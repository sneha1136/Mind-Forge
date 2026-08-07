FROM node:18-alpine

# Install OpenSSL for Prisma engine on Alpine
RUN apk add --no-cache openssl

# Create app directory
WORKDIR /app

# Copy package manifests and Prisma schema before running npm install
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install dependencies (runs postinstall prisma generate)
RUN npm install --production=false

# Copy app source
COPY . .

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "src/server.js"]
