FROM node:22-bookworm

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

ENV NODE_ENV=production

RUN npm ci --omit=dev

RUN npx playwright install-deps chromium

RUN apt-get update \
    && apt-get install -y docker.io \
    && rm -rf /var/lib/apt/lists/*

RUN npx playwright install chromium

EXPOSE 5000

CMD ["node", "dist/server.js"]