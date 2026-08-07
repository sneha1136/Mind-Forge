FROM node:18-alpine

WORKDIR /app

# install deps
COPY package.json package-lock.json* ./
RUN npm install --production

# copy source
COPY prisma ./prisma
COPY src ./src

# generate prisma client
RUN npx prisma generate || true

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "src/server.js"]
