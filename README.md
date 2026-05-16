# ContentFlow AI

ContentFlow AI is a premium AI SaaS starter for creator-focused content generation. It includes email/password authentication, protected dashboard routes, Gemini-powered content generation, and user-scoped history backed by PostgreSQL.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style primitives
- Framer Motion
- Prisma 7
- PostgreSQL / Neon
- Google Gemini via `@google/generative-ai`
- JWT sessions with `jose`
- Password hashing with `bcryptjs`

## Features

- Premium dark SaaS landing page
- Register and login with secure password hashing
- httpOnly cookie session
- Protected dashboard, generate, and history routes
- Gemini generation for captions, hooks, hashtags, rewrites, and content ideas
- User-scoped saved generation history
- Dashboard analytics from real user data
- History search, type filters, and copy actions
- Responsive glassmorphism UI

## Auth Flow

Users register with name, email, and password. Passwords are hashed with `bcryptjs` and never returned to the client. Login verifies the password hash and creates a signed JWT session stored in an httpOnly cookie named `contentflow_session`.

Protected routes call `requireUser()` and redirect unauthenticated users to `/login`.

Auth endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## AI Generation Flow

Authenticated users submit a content brief from `/generate`. The server validates the request, calls Gemini using the server-only `GEMINI_API_KEY`, saves the output to the `Generation` table, and returns the saved record.

Supported generation types:

- `CAPTION`
- `HOOK`
- `HASHTAGS`
- `REWRITE`
- `CONTENT_IDEA`

Endpoint:

- `POST /api/generate`

## Database Setup With Neon

1. Create a Neon project.
2. Copy the pooled or direct PostgreSQL connection string.
3. Add it to `.env` as `DATABASE_URL`.
4. Run Prisma migration commands.

The Prisma datasource is PostgreSQL-ready and uses the Prisma PostgreSQL adapter.

## Environment Variables

Create `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
GEMINI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-2.5-flash"
AUTH_SECRET="replace-with-a-long-random-secret"
NEXTAUTH_SECRET="replace-with-a-long-random-secret-if-using-nextauth"
```

`GEMINI_MODEL` is optional. The generation route falls back through supported Gemini Flash models.

## Prisma Migration Steps

Generate the Prisma client:

```bash
npx prisma generate
```

Create and apply a migration:

```bash
npx prisma migrate dev --name init
```

For production:

```bash
npx prisma migrate deploy
```

## Local Setup

Install dependencies:

```bash
npm install
```

Generate Prisma client:

```bash
npx prisma generate
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Build:

```bash
npm run build
```

## Deployment On Vercel

1. Push the project to GitHub.
2. Import it into Vercel.
3. Add environment variables in Vercel project settings.
4. Ensure the production database has migrations applied.
5. Deploy.

Recommended Vercel environment variables:

- `DATABASE_URL`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `AUTH_SECRET`

## Screenshots

Screenshots live in `docs/screenshots`:

- `landing.png`
- `auth.png`
- `dashboard.png`
- `generate.png`
- `history.png`

## Known Limitations

- No payments or subscriptions yet.
- No password reset flow yet.
- No email verification yet.
- No team/workspace multi-user model yet.
- Generation quality depends on the configured Gemini model and API availability.
- Database-backed flows require a migrated PostgreSQL database.
