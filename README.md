# Fitness Tracker

A full-stack web app for logging gym workouts by date. Pick a day on the calendar, log sets (exercise, weight, reps), and review your history grouped by exercise.

**Live demo:** [fitness-tracker-delta-mauve.vercel.app](https://fitness-tracker-delta-mauve.vercel.app/)

## Features

- **Date-based workout view** — browse and log workouts for any day via an interactive calendar
- **Exercise catalog** — choose from 65+ pre-seeded gym exercises organized by muscle group
- **Set logging** — add, edit, and delete individual sets with weight and rep tracking
- **Grouped display** — sets are grouped by exercise in expandable MUI accordions
- **Form validation** — React Hook Form + Zod for client-side validation on set entry

## Tech Stack

| Layer    | Technologies |
| -------- | ------------ |
| Frontend | React 19, TypeScript, Vite, MUI, React Hook Form, Zod |
| Backend  | Node.js, Express 5, TypeScript, Typegoose |
| Database | MongoDB Atlas |
| Deploy   | Vercel (frontend), Railway (backend) |

## Project Structure

```
Fitness-tracker/
├── frontend/          # React + Vite SPA
│   └── src/
│       ├── components/   # WorkoutCard, SetTable, UpsertSetDialog, etc.
│       ├── pages/        # HomePage
│       └── ExerciseService.ts
└── backend/           # Express REST API
    └── src/
        ├── models/       # Exercise, ExerciseCatalog
        ├── routes/       # /api/exercise, /api/exerciseCatalog
        └── scripts/      # seedExerciseCatalog, migrateExerciseCatalog
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (or local MongoDB)

### 1. Clone the repo

```bash
git clone https://github.com/danishslife/Fitness-tracker.git
cd Fitness-tracker
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
DATABASE_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
PORT=3000
```

Seed the exercise catalog:

```bash
npm run seed:catalog
```

Start the API:

```bash
npm run dev
```

The server runs at `http://localhost:3000`.

### 3. Frontend setup

In a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:3000
```

Start the dev server:

```bash
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## API Endpoints

### Exercises (`/api/exercise`)

| Method | Route        | Description |
| ------ | ------------ | ----------- |
| GET    | `/`          | List exercises for a date range (`startDate`, `endDate` query params) |
| GET    | `/:id`       | Get a single exercise |
| POST   | `/`          | Create a set (`exerciseCatalog`, `weight`, `reps`) |
| PATCH  | `/:id`       | Update weight and/or reps |
| DELETE | `/:id`       | Delete a set |

### Exercise Catalog (`/api/exerciseCatalog`)

| Method | Route | Description |
| ------ | ----- | ----------- |
| GET    | `/`   | List all catalog exercises |
| POST   | `/`   | Add a custom exercise to the catalog |

## Deployment

This project is deployed as a split full-stack app:

- **Frontend (Vercel)** — set root directory to `frontend`, build command `npm run build`, output `dist`. Add env var `VITE_API_URL` pointing to your Railway backend URL.
- **Backend (Railway)** — set root directory to `backend`, build command `npm run build`, start command `npm start`. Add `DATABASE_URL` and let Railway set `PORT`.
- **Database (MongoDB Atlas)** — allow network access from your deployment IPs (or `0.0.0.0/0` for development). Run `npm run seed:catalog` against the production database once after first deploy.

## Scripts

### Backend

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production server |
| `npm run seed:catalog` | Seed/upsert exercise catalog entries |

### Frontend

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |

## License

MIT
