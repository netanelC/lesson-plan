# ==========================================
# Stage 1: Prune (Extract only what we need)
# ==========================================
FROM node:22-alpine AS base
# Need turbo installed globally to run the prune command
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ---
FROM base AS prepare
RUN npm install -g turbo@^2
COPY . .
RUN turbo prune planner-manager --docker

# ==========================================
# Stage 2: Build (Leverage Cache & Compile)
# ==========================================
FROM base AS builder
RUN npm install -g pnpm@10.0.0
WORKDIR /app

# FIRST: Copy ONLY the package.jsons and lockfiles
COPY --from=prepare /app/out/json/ .

# Install dependencies. 
# Docker will CACHE this layer! It will only re-run if a dependency actually changed.
RUN pnpm install --frozen-lockfile

# SECOND: Now copy the actual source code
COPY --from=prepare /app/out/full/ .

# Build the project (includes Prisma generation based on your prebuild script)
RUN pnpm turbo build

# ==========================================
# Stage 3: Runner (Production Environment)
# ==========================================
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV SERVER_PORT=8080

# Copy cleanly from the deploy step
COPY --from=builder /app .

WORKDIR /app/apps/planner-manager

EXPOSE 8080

CMD ["node", "dist/server.js"]
