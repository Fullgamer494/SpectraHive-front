# Frontend image for local development and testing only (RN-13).
# Production is a static Vite build deployed on Vercel, not this image.
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev"]

