# ─── Stage 1: Builder ───────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy only package files first (layer caching)
COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ ./

# ─── Stage 2: Runtime ───────────────────────────────────────────────────
FROM node:22-alpine AS runtime

# Add non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy production node_modules and app from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

# Don't run as root
USER appuser

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:5000/health || exit 1

CMD ["node", "server.js"]
