# build
FROM node:26-alpine as build

WORKDIR /app/frontend
COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./
RUN npm ci --silent
COPY ./frontend/ ./
ARG VITE_GOOGLE_MAPS_API_KEY
RUN npm run build

# kopiranje React fajlova
FROM nginx:stable-alpine
COPY --from=build /app/frontend/build /usr/share/nginx/html

# pokretanje nginx
CMD ["nginx", "-g", "daemon off;"]