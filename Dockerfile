# ─── Stage 1: Build the React Frontend ───────────────────────────────────────
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Install dependencies
COPY frontend/package*.json ./
RUN npm ci --prefer-offline

# Copy source and build production assets
COPY frontend/ ./
RUN npm run build

# ─── Stage 2: Run the Express Backend ────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Install only production backend dependencies
COPY backend/package*.json ./backend/
RUN npm ci --omit=dev --prefix backend --prefer-offline

# Copy backend source code
COPY backend/ ./backend/

# Copy compiled frontend from Stage 1 into the expected location
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Start the Express server (which will also serve the React frontend)
CMD ["node", "backend/src/server.js"]
