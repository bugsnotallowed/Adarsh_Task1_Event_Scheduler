# Event Scheduler Frontend

## Setup

1. Copy `.env.example` to `.env` and set `VITE_API_URL` if your backend is not at http://localhost:4000
2. Install:
   npm install
3. Run:
   npm run dev

## Notes

- The app expects the backend endpoints from the backend project:
  - /api/auth/register
  - /api/auth/login
  - /api/events
  - /api/events/conflicts
  - /api/events/suggest
  - /api/users/me
  - /api/users/working-hours
- JWT is stored in localStorage as `token`.
