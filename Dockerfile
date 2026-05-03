# Step 1: Build stage
FROM node:20-alpine AS build

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies (frozen-lockfile for consistency)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application (skipping TS checks via our modified build script)
RUN pnpm build

# Step 2: Runtime stage (Nginx)
FROM nginx:stable-alpine

# Custom Nginx configuration to support SPA routing (React Router)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Copy production artifacts from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
