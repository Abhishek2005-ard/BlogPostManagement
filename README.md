# MERN Blog Management App

This is a full-stack blog application built with the MERN stack (MongoDB, Express, React, Node). I built this for my internship project.

## Features
- User registration and login (uses JWT cookies for auth)
- Create, edit, delete, and view blog posts
- Frontend built with React (Vite) and TailwindCSS
- Backend is an Express REST API with MongoDB

## Tech used

**Frontend:** React, Vite, Tailwind CSS, Zustand, React Query, React Hook Form, Zod.
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, multer (for uploads).

## Getting Started locally

First, clone this repo. Then you'll need two terminal windows to run both ends.

### 1. Backend
cd into the `backend` folder and install dependencies:
```bash
npm install
```
Create a `.env` file in the backend folder. You need these variables:
```
PORT=5000
MONGO_URI=your_mongo_url_here
JWT_SECRET=make_up_a_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```
Then run the backend:
```bash
npm run dev
```

### 2. Frontend
Open another terminal, cd into `frontend`:
```bash
npm install
```
Create a `.env` file in the frontend folder and add:
```
VITE_API_URL=http://localhost:5000/api
```
Run the frontend:
```bash
npm run dev
```

## Deployment Notes
If you are deploying this (e.g. backend on Render, frontend on Vercel), remember to set the environment variables properly!
- Vercel needs `VITE_API_URL` set to the backend's live URL.
- Render needs `CLIENT_URL` set to the Vercel URL (make sure there is no trailing slash).
- Render also needs `NODE_ENV=production` so the auth cookies don't get blocked by the browser.
