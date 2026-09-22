# Build stage
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# VITE_* vars are baked into the bundle at build time — pass them as
# --build-arg (or a build-time .env) rather than expecting them at runtime.
ARG VITE_AUTH_URL
ARG VITE_API_URL
ARG VITE_CLIENT_ID
ENV VITE_AUTH_URL=$VITE_AUTH_URL \
    VITE_API_URL=$VITE_API_URL \
    VITE_CLIENT_ID=$VITE_CLIENT_ID
RUN npm run build

# Serve stage
FROM nginx:1.31-alpine AS serve
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY security-headers.conf /etc/nginx/security-headers.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
