# Mind-Forge Backend

A Node.js/Express REST API with Prisma ORM, PostgreSQL, Socket.IO real-time chat, and OpenAI integration.

## Stack
- **Runtime**: Node.js 18
- **Framework**: Express.js
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: JWT + bcryptjs
- **Real-time**: Socket.IO
- **AI**: OpenAI GPT-4o-mini

## API Endpoints
| Route | Description |
|---|---|
| `GET /` | Health check |
| `POST /api/auth/register` | Register a new user |
| `POST /api/auth/login` | Login, returns JWT |
| `GET /api/user/me` | Get current user profile |
| `POST /api/flashcards` | Create a flashcard |
| `GET /api/flashcards` | List user's flashcards |
| `POST /api/ai/generate` | Generate an AI question |
| `GET /api/analytics` | Get user analytics |
| `POST /api/assessments` | Submit assessment result |
| `PUT /api/linked-platforms` | Update linked platforms |

## Deploying to Render.com (Free)

### Step 1 – Create a free PostgreSQL database
1. Go to [neon.tech](https://neon.tech) and sign up (free tier)
2. Create a new project → copy the **connection string** (looks like `postgresql://user:pass@host/db?sslmode=require`)

### Step 2 – Deploy to Render
1. Push this repo to GitHub (already done ✅)
2. Go to [render.com](https://render.com) → **New** → **Web Service**
3. Connect your GitHub account → select `sneha1136/Mind-Forge`
4. Render auto-detects the `render.yaml` — click **Deploy**
5. In the **Environment** tab, set these variables:
   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | Your Neon connection string |
   | `OPENAI_API_KEY` | Your OpenAI API key |
   | `CLIENT_ORIGIN` | URL of your frontend (or `*` for testing) |

### Step 3 – Done!
Your API will be live at `https://mind-forge-backend.onrender.com`

## Local Development

```bash
# 1. Clone
git clone https://github.com/sneha1136/Mind-Forge.git
cd Mind-Forge

# 2. Copy env and fill in values
cp .env.example .env

# 3. Install dependencies (also runs prisma generate automatically)
npm install

# 4. Push schema to database
npx prisma db push

# 5. Start dev server
npm run dev
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: 5000) |
| `DATABASE_URL` | **Yes** | PostgreSQL connection string |
| `JWT_SECRET` | **Yes** | Secret for signing JWT tokens |
| `OPENAI_API_KEY` | **Yes** | OpenAI API key for AI features |
| `CERTIFICATE_SECRET` | **Yes** | Secret for certificate hashing |
| `CLIENT_ORIGIN` | No | Allowed CORS origin (default: `*`) |
