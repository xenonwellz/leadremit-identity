FROM node:20-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN node ace build
EXPOSE 3333
RUN chmod +x .deploy/entrypoint.sh
ENTRYPOINT ["sh", "./.deploy/entrypoint.sh"]
