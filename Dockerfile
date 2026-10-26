# Builds the web app and serves it together with the API from one Node process, so both share one origin.
FROM node:22-alpine AS base
RUN npm install -g pnpm@10.34.3

FROM base AS web
WORKDIR /web
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
# The LINE channel ID is public and is baked into the bundle; leave it empty to build the demo-mode UI.
ARG VITE_LINE_CHANNEL_ID
RUN pnpm build

FROM base AS server
WORKDIR /server
COPY server/package.json server/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY server/tsconfig.json ./
COPY server/src ./src
RUN pnpm typecheck && pnpm prune --prod

FROM node:22-alpine
ENV NODE_ENV=production PORT=3000
WORKDIR /app
COPY --from=server /server/node_modules ./node_modules
COPY --from=server /server/package.json ./
COPY --from=server /server/src ./src
COPY server/migrations ./migrations
COPY --from=web /web/dist ./public
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1
CMD ["node", "src/index.ts"]
