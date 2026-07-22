# UniFind — Campus Lost & Found Management System

A centralized web platform for university students to report lost or found items, search listings, and submit ownership claims — built with the MERN stack.

## Tech Stack

- **Frontend:** React.js (Vite), React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT with role-based access control

## User Roles

| Role | Capabilities |
|---|---|
| **Student** | Register/login, manage profile, report lost/found items, upload images, search & filter, submit claims, track claim status |
| **Moderator** | Review and verify reports, approve/reject submissions and claims, handle flagged content, maintain moderation logs |
| **Administrator** | Manage users & moderators, manage categories, view analytics, monitor system activity, platform configuration |

## Project Structure

```
unifind/
├── client/          # React frontend
│   └── src/
│       ├── assets/
│       ├── components/   # Header, Navbar, Hero, Footer, reusable UI
│       ├── pages/        # Home, Login, About, Contact, dashboards, NotFound
│       ├── context/      # AuthContext (JWT + role state)
│       ├── services/     # api.js (axios instance)
│       ├── routes/       # ProtectedRoute (role-based guard)
│       └── styles/
├── server/          # Express backend
│   ├── config/       # db.js (MongoDB connection)
│   ├── controllers/
│   ├── models/        # User, Item, Claim, Category, ModerationLog
│   ├── routes/
│   ├── middleware/     # auth, role, upload, error handling
│   └── server.js
└── README.md
```

## Team

| Member | Module |
|---|---|
| 17471 – D G M B Gunasekara | Authentication & User Management |
| 17488 – G G M S Kandewatta | Lost & Found Management |
| 17500 – W A M Nuwanga | Moderator Dashboard |
| 17540 – A H M K Y B Wijekoon | Administrator Dashboard |

## Getting Started

### Prerequisites
- Node.js and npm installed (`node -v`, `npm -v`)
- MongoDB running locally, or a MongoDB Atlas connection string

### Clone and set up

```bash
git clone https://github.com/Muditha-Sankalpa/campus-lost-and-found.git
cd campus-lost-and-found
git checkout dev
```

### Backend setup

```powershell
cd server
npm install
Copy-Item .env.example .env    # fill in your Mongo URI and JWT secret
npm run dev
```

Server runs on `http://localhost:5000`.

### Frontend setup

```powershell
cd client
npm install
Copy-Item .env.example .env    # set VITE_API_URL
npm run dev
```

Client runs on `http://localhost:5173`.

## Environment Variables

**server/.env.example**
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

**client/.env.example**
```
VITE_API_URL=http://localhost:5000/api
```

> `.env` files are gitignored. Never commit real credentials — share connection strings privately with the team.

## Branching Workflow

```
main         → stable, demo-ready code only
dev          → integration branch, all features merge here first
feature/*    → one branch per task, branched off dev
```

**Branch naming convention:** `feature/<module>-<task>`
Examples: `feature/auth-login`, `feature/items-search-filter`, `feature/moderation-review`, `feature/admin-analytics`

**Workflow for each task:**
```bash
git checkout dev
git pull origin dev
git checkout -b feature/auth-login
# ... do the work ...
git add .
git commit -m "Implement JWT login endpoint"
git push origin feature/auth-login
```

Then open a Pull Request into `dev` on GitHub and request a review from a teammate. `dev` is merged into `main` only at stable milestones (e.g. before a demo or submission).

## API Overview

| Endpoint prefix | Handles |
|---|---|
| `/api/auth` | Registration, login, JWT issuance |
| `/api/items` | Lost/found item CRUD, search, filtering |
| `/api/claims` | Ownership claim submission and status |
| `/api/moderation` | Report/claim review and approval |
| `/api/admin` | User/moderator/category management, analytics |

## License

This project is developed as a university mini project for academic purposes.