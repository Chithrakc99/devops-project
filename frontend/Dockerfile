# ─── Stage 1: Build ─────────────────────────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ─── Stage 2: Serve ─────────────────────────────────────────────────────
FROM nginx:stable-alpine AS runtime

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config for SPA routing
RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    \n\
    # SPA fallback - all routes serve index.html\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    \n\
    # Cache static assets\n\
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, immutable";\n\
    }\n\
    \n\
    # Gzip compression\n\
    gzip on;\n\
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
