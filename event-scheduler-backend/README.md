# Event Scheduler Backend

## Quick start

1. Copy `.env.example` to `.env` and set values (MONGO_URI, JWT_SECRET, PORT)
2. Install dependencies:
   npm install
3. Start server:
   npm run dev

## Endpoints (summary)

- POST /api/auth/register   { name, email, password, workingHours? }
- POST /api/auth/login      { email, password }
- GET  /api/events          (auth)
- POST /api/events          { title, description, startTime, endTime } (auth)
- PUT  /api/events/:id      (auth)
- DELETE /api/events/:id    (auth)
- GET  /api/events/conflicts (auth)
- POST /api/events/suggest  { eventId?, durationMinutes? } (auth)
- GET  /api/users/me        (auth)
- PUT  /api/users/working-hours { start, end } (auth)

Times are "HH:MM" strings (24-hour). Working hours stored per-user.

