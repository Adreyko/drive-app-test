FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--workspace", "@drive/web", "--", "--hostname", "0.0.0.0", "--port", "3000"]
