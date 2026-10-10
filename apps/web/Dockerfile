# Stage 1: Build Frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root monorepo files
COPY package.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/schemas ./packages/schemas

# Install dependencies
RUN npm install

# Copy web app source code
COPY apps/web ./apps/web

# Build web distribution
WORKDIR /app/apps/web
RUN npm run build

# Stage 2: Serve via Nginx
FROM nginx:alpine

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

