FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install all deps (includes prisma CLI needed for generate)
COPY package.json package-lock.json* ./
RUN npm install --production=false

# Copy app source
COPY . .

# Generate Prisma Client (required before running the app)
RUN npx prisma generate

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "src/server.js"]
