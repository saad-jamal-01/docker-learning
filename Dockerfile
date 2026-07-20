FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm prune --production

# ==========================================

FROM node:20

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/. . 

EXPOSE 3000

CMD ["node", "app.js"]
