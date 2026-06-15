import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PATCH'] }
});

// ─── MongoDB Models ───────────────────────────────────────────
const queueSchema = new mongoose.Schema({
  currentToken: { type: Number, default: 0 },
  avgConsultTime: { type: Number, default: 10 }
});
const Queue = mongoose.model('Queue', queueSchema);

const patientSchema = new mongoose.Schema({
  tokenNumber: { type: Number, required: true },
  name: { type: String, required: true },
  status: { type: String, default: 'waiting' },
  addedAt: { type: Date, default: Date.now }
});
const Patient = mongoose.model('Patient', patientSchema);

// ─── Helper: Get full queue state ─────────────────────────────
async function getQueueState() {
  let queue = await Queue.findOne();
  if (!queue) queue = await Queue.create({});

  const waitingPatients = await Patient.find({ status: 'waiting' })
    .sort({ tokenNumber: 1 });

  const patientsWithWait = waitingPatients.map(p => ({
    _id: p._id,
    tokenNumber: p.tokenNumber,
    name: p.name,
    status: p.status,
    estimatedWait: Math.max(0, (p.tokenNumber - queue.currentToken)) * queue.avgConsultTime
  }));

  return {
    currentToken: queue.currentToken,
    avgConsultTime: queue.avgConsultTime,
    waitingPatients: patientsWithWait
  };
}

// ─── Helper: Broadcast to all clients ─────────────────────────
async function broadcastQueue() {
  const state = await getQueueState();
  io.emit('queue:updated', state);
}

// ─── Routes ───────────────────────────────────────────────────

// Add patient
app.post('/api/patients', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Patient name is required' });
    }

    // Get highest token number atomically
    const lastPatient = await Patient.findOne().sort({ tokenNumber: -1 });
    const queue = await Queue.findOne();
    const lastToken = lastPatient ? lastPatient.tokenNumber : (queue ? queue.currentToken : 0);
    const newToken = lastToken + 1;

    const patient = await Patient.create({ tokenNumber: newToken, name: name.trim() });
    await broadcastQueue();
    res.status(201).json({ success: true, tokenNumber: newToken, patient });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Call next token
app.post('/api/queue/call-next', async (req, res) => {
  try {
    const waitingPatients = await Patient.find({ status: 'waiting' }).sort({ tokenNumber: 1 });
    if (waitingPatients.length === 0) {
      return res.status(400).json({ error: 'No patients in queue' });
    }

    const nextPatient = waitingPatients[0];
    await Patient.findByIdAndUpdate(nextPatient._id, { status: 'called' });
    await Queue.findOneAndUpdate({}, { currentToken: nextPatient.tokenNumber }, { upsert: true });

    await broadcastQueue();
    res.json({ success: true, calledToken: nextPatient.tokenNumber });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update average consultation time
app.patch('/api/queue/avg-time', async (req, res) => {
  try {
    const { avgConsultTime } = req.body;
    const time = Math.max(1, parseInt(avgConsultTime) || 10);
    await Queue.findOneAndUpdate({}, { avgConsultTime: time }, { upsert: true });
    await broadcastQueue();
    res.json({ success: true, avgConsultTime: time });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset queue
app.post('/api/queue/reset', async (req, res) => {
  try {
    await Patient.deleteMany({});
    await Queue.findOneAndUpdate({}, { currentToken: 0 }, { upsert: true });
    await broadcastQueue();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get queue state
app.get('/api/queue', async (req, res) => {
  try {
    const state = await getQueueState();
    res.json(state);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Socket.IO ────────────────────────────────────────────────
io.on('connection', async (socket) => {
  console.log('Client connected:', socket.id);
  const state = await getQueueState();
  socket.emit('queue:updated', state);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// ─── Start Server ─────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected ✅');
    httpServer.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000} ✅`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));