# BlogCraft — Deployment Guide

BlogCraft is a full-stack MERN blog post management system. In production, the Express backend serves the compiled React frontend — meaning the entire application runs as a **single Node.js process** on a single port.

---

## Required Environment Variables

| Variable        | Description                                       | Example                                  |
|-----------------|---------------------------------------------------|------------------------------------------|
| `NODE_ENV`      | Must be `production` to serve the frontend        | `production`                             |
| `PORT`          | Port the Express server listens on                | `5000`                                   |
| `MONGO_URI`     | Full MongoDB connection string                    | `mongodb+srv://user:pass@cluster/db`     |
| `JWT_SECRET`    | Long, random secret for signing JWTs              | `a-very-long-random-string-here`         |
| `JWT_EXPIRES_IN`| JWT token expiry duration                         | `7d`                                     |
| `CLIENT_URL`    | Allowed CORS origin (same as your domain)         | `https://your-app.onrender.com`          |

> **Security:** Never commit `.env` files. Always inject secrets through your hosting provider's environment variable management.

---

## Option 1: Docker Compose (Recommended for VPS / Self-Hosted)

### Prerequisites
- Docker Engine & Docker Compose installed on your server.

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/blogcraft.git
cd blogcraft

# 2. Create an env file for secrets
cp backend/.env backend/.env.prod
# Edit backend/.env.prod and set real values (especially MONGO_URI & JWT_SECRET)

# 3. Pass secrets via environment or a .env at the root
export JWT_SECRET="your_super_secret_random_string"

# 4. Build and start all services
docker compose up --build -d

# 5. The app is now available at http://your-server-ip:5000
```

### Stopping the Stack
```bash
docker compose down        # keep database volume
docker compose down -v     # also remove database volume (DESTRUCTIVE)
```

---

## Option 2: Render (Free / Paid Cloud Platform)

1. Push your code to a public or private GitHub repository.
2. Go to [Render](https://render.com) → **New → Web Service**.
3. Connect your repository.
4. Configure the service:

   | Setting           | Value                                      |
   |-------------------|--------------------------------------------|
   | **Root Directory**| *(leave blank — repo root)*               |
   | **Build Command** | `npm run build`                            |
   | **Start Command** | `npm start`                                |
   | **Node Version**  | `20`                                       |

5. Add all [Required Environment Variables](#required-environment-variables) in the **Environment** tab.
6. For `MONGO_URI`, use **MongoDB Atlas** (free tier) connection string.
7. Click **Deploy**. Render will run the build and start the server automatically.

---

## Option 3: Railway

1. Push code to GitHub.
2. Go to [Railway](https://railway.app) → **New Project → Deploy from GitHub**.
3. Select your repository.
4. Add a **MongoDB plugin** (or connect a MongoDB Atlas cluster via `MONGO_URI`).
5. Set all [Required Environment Variables](#required-environment-variables).
6. Railway will auto-detect Node.js. Override:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
7. Deploy.

---

## Option 4: Manual VPS (Ubuntu/Debian)

```bash
# 1. Install Node.js 20 and MongoDB
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
# Follow official MongoDB installation for your OS: https://www.mongodb.com/docs/manual/installation/

# 2. Clone the repo
git clone https://github.com/your-username/blogcraft.git
cd blogcraft

# 3. Install dependencies and build frontend
npm run install:all
npm run build

# 4. Set environment variables (or create backend/.env with production values)
export NODE_ENV=production
export MONGO_URI="mongodb://localhost:27017/mern_app"
export JWT_SECRET="your_super_secret_random_string"
export PORT=5000

# 5. Start the backend (serves frontend too)
npm start

# 6. (Optional) Use PM2 for process management
npm install -g pm2
pm2 start "npm start" --name blogcraft
pm2 save
pm2 startup
```

---

## Local Production Test

You can test production mode locally **without Docker**:

```bash
# 1. Build the frontend
npm run build

# 2. Start the backend in production mode
cd backend
NODE_ENV=production node src/server.js

# 3. Open http://localhost:5000 — you should see the full app
```

---

## Project Structure (Deployment Relevant)

```
.
├── Dockerfile              # Multi-stage production Docker image
├── docker-compose.yml      # MongoDB + App orchestration
├── .dockerignore
├── .gitignore
├── package.json            # Root scripts (install:all, build, start)
│
├── backend/
│   ├── src/server.js       # Express API + serves frontend/dist in production
│   ├── .env                # Local dev env (do NOT commit with real secrets)
│   └── package.json
│
└── frontend/
    ├── src/                # React source
    ├── dist/               # Built output (generated by npm run build)
    └── package.json
```
