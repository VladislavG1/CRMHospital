FROM node:20-slim

RUN apt-get update 
WORKDIR /app

RUN apt-get update && apt-get install -y bash 
RUN apt-get install -y openssl

COPY package*.json ./

RUN npm install -g npm@11.4.1
RUN npm install -g @nestjs/cli

RUN npm install

COPY prisma ./prisma

RUN npx prisma generate || true
RUN npx prisma db push || true


COPY tsconfig*.json nest-cli.json* ./
COPY src ./src
# RUN npm run build

RUN npm prune


EXPOSE 3003

# CMD ["sh", "-c", "npx prisma migrate deploy || true; node dist/main.js"]
