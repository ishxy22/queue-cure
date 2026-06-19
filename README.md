# Queue Cure '26 🏥
 
> Replace paper tokens with a live digital queue. Patients know exactly when they'll be called.
 
[![Live Demo](https://img.shields.io/badge/Live-Demo-blue)](https://queue-cure-fawn.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-black)](https://github.com/ishxy22/queue-cure)
[![Backend](https://img.shields.io/badge/Backend-Render-green)](https://queue-cure-bhw8.onrender.com)
 
---
 
## Problem Statement
 
76% of India's 1.5 million clinics run on paper token slips and shouting. Patients wait 2–3 hours with zero visibility. Receptionists manage everything from memory. Queue Cure fixes this with a real-time digital queue visible to patients on their phone, controlled by the receptionist on one screen.
 
---
 
## Live Demo
 
- **Patient Waiting Room:** https://queue-cure-fawn.vercel.app/waiting
- **Receptionist Dashboard:** https://queue-cure-fawn.vercel.app/receptionist
- **Backend API:** https://queue-cure-bhw8.onrender.com
- **Default Staff Password:** clinic123
---
 
## Features
 
- Live queue updates via Socket.IO — zero page refresh
- Receptionist dashboard: add patient, call next token, pause/reset queue
- Dynamic wait time calculation: tokensAhead × avgConsultTime
- QR code for patients to open waiting room on phone
- Staff login with password protection
- Mobile responsive patient waiting room
---
 
## Tech Stack
 
| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite |
| Styling | Tailwind CSS |
| Backend | Node.js + Express |
| Real-time | Socket.IO |
| Database | MongoDB Atlas |
| Deployment | Vercel (frontend) + Render (backend) |
 
---
 
## How It Works
 
A receptionist adds patients and assigns tokens from one screen. The moment "Call Next Token" is clicked, a Socket.IO event broadcasts the updated queue state to all connected clients instantly — no refresh needed. Wait times are calculated dynamically using the formula: `tokensAhead × avgConsultTime`.
 
---
 
## Local Setup
 
```bash
# Clone the repo
git clone https://github.com/ishxy22/queue-cure.git
cd queue-cure
 
# Setup backend
cd server
npm install
# Create .env file with MONGO_URI and PORT=5000
node index.js
 
# Setup frontend (new terminal)
cd client
npm install
npm run dev
```
 
### Environment Variables
 
**server/.env**
```
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
```
 
**client/.env**
```
VITE_SERVER_URL=http://localhost:5000
```
 
---
 
## Socket Events
 
| Event | Emitted By | Received By | Payload |
|-------|-----------|-------------|---------|
| `queue:updated` | Server | All clients | currentToken, avgConsultTime, waitingPatients |
 
---
 
## Future Scope
 
- Doctor dashboard with consultation completion tracking
- WhatsApp / SMS notifications via Twilio
- Multi-clinic support with separate queue namespaces
- Appointment booking and pre-registration
- Queue analytics — peak hours, avg wait time
---
 
## Author
 
**Ishita Yadav** — Built for Queue Cure '26 Hackathon on Wooble
 
*Built for India's neighbourhood clinics.*