# Fitness Tracker

A full-stack web app for logging gym workouts by date. Create an account, pick a day on the calendar, log sets (exercise, weight, reps), and review your own history grouped by exercise.

**Live demo:** [fitness-tracker-delta-mauve.vercel.app](https://fitness-tracker-delta-mauve.vercel.app/)

## Features

- **Accounts** — register and log in with email and password; each user only sees their own sets
- **JWT auth** — the API issues a token after login/register; the frontend stores it and sends it on workout requests
- **Date-based workout view** — browse and log workouts for any day via an interactive calendar
- **Exercise catalog** — choose from 65+ pre-seeded gym exercises organized by muscle group (shared list)
- **Set logging** — add, edit, and delete individual sets with weight and rep tracking
- **Grouped display** — sets are grouped by exercise in expandable MUI accordions
- **Form validation** — React Hook Form + Zod on the client; Zod on the API for auth and set payloads

## Tech Stack

| Layer    | Technologies |
| -------- | ------------ |
| Frontend | React 19, TypeScript, Vite, MUI, React Hook Form, Zod |
| Backend  | Node.js, Express 5, TypeScript, TypeORM, JWT, bcrypt, Zod |
| Database | PostgreSQL |
| Deploy   | Vercel (frontend), Railway (backend) |

## Project Structure

```
Fitness-tracker/
├── frontend/          # React + Vite SPA
│   └── src/
│       ├── api/          # AuthService, ExerciseService, authFetch, etc.
│       ├── components/   # WorkoutCard, SetTable, UpsertSetDialog, etc.
│       ├── pages/        # LoginPage, HomePage
│       └── types/
└── backend/           # Express REST API
    └── src/
        ├── entities/     # TypeORM User, Exercise, ExerciseCatalog
        ├── middlewares/  # requireAuth, schemaValidator
        ├── routes/       # /api/auth, /api/exercise, /api/exerciseCatalog
        ├── data-source.ts
        └── scripts/      # seedExerciseCatalog
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- PostgreSQL (local install, Docker, or a hosted provider such as Neon or Supabase)

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
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<dbname>
PORT=3000
JWT_SECRET=<long random string>
```

`JWT_SECRET` is required. The API will not start without it. Generate one locally, for example in PowerShell:

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Do not commit `.env`.

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

Open the URL shown in the terminal (typically `http://localhost:5173`). Register or log in, then log sets as before.

## API Endpoints

### Auth (`/api/auth`)

| Method | Route       | Auth   | Description |
| ------ | ----------- | ------ | ----------- |
| POST   | `/register` | No     | Create an account (`email`, `password` min 8 characters). Returns `{ token, user }`. |
| POST   | `/login`    | No     | Sign in. Returns the same `{ token, user }` shape. |
| GET    | `/me`       | Bearer | Current user (`id`, `email`, `firstName`, `lastName`). |

Send the token on protected routes as:

```http
Authorization: Bearer <token>
```

### Exercises (`/api/exercise`)

All of these require a valid Bearer token. Sets are scoped to the logged-in user.

| Method | Route        | Description |
| ------ | ------------ | ----------- |
| GET    | `/`          | List this user's sets for a date range (`startDate`, `endDate` query params) |
| GET    | `/:id`       | Get a single set (404 if it belongs to someone else) |
| POST   | `/`          | Create a set (`exerciseCatalog` catalog id, `weight`, `reps`, `performedAt`). Owner is taken from the token. |
| PATCH  | `/:id`       | Update weight and/or reps |
| DELETE | `/:id`       | Delete a set |

### Exercise Catalog (`/api/exerciseCatalog`)

Public shared catalog (no auth).

| Method | Route | Description |
| ------ | ----- | ----------- |
| GET    | `/`   | List all catalog exercises |
| POST   | `/`   | Add a custom exercise to the catalog |

## Deployment

This project is deployed as a split full-stack app:

- **Frontend (Vercel)** — set root directory to `frontend`, build command `npm run build`, output `dist`. Add env var `VITE_API_URL` pointing to your Railway backend URL. Do not put `JWT_SECRET` on Vercel.
- **Backend (Railway)** — set root directory to `backend`, build command `npm run build`, start command `npm start`. Add `DATABASE_URL` and `JWT_SECRET`. Let Railway set `PORT`. Changing variables triggers a redeploy.
- **Database (PostgreSQL)** — provision a Postgres instance on Railway (or similar), set `DATABASE_URL`, and apply your schema (migrations or manual DDL). Run `npm run seed:catalog` once after first deploy.

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
