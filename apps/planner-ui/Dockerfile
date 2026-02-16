# ==========================================
# Stage 1: Prune (Extract only what we need)
# ==========================================
FROM node:22-alpine AS base
WORKDIR /app

# ---
FROM base AS prepare
RUN npm install -g turbo@^2
COPY . .
RUN turbo prune planner-ui --docker

# ==========================================
# Stage 2: Build (Leverage Cache & Compile)
# ==========================================
FROM base AS builder
RUN npm install -g pnpm@10.0.0
WORKDIR /app

# Cache dependencies
COPY --from=prepare /app/out/json/ .

RUN pnpm install --frozen-lockfile

# Copy source and build
COPY --from=prepare /app/out/full/ .

# Declare the build arguments
ARG VITE_API_BASE_URL
ARG VITE_GOOGLE_CLIENT_ID

# Expose them to the Vite build process
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN pnpm turbo run build

# ==========================================
# Stage 3: Runner (Production Environment)
# ==========================================
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV SERVER_PORT=3000

RUN npm i -g serve

COPY --from=builder /app/apps/planner-ui/dist ./dist


# WORKDIR /app/apps/planner-ui

EXPOSE 3000
CMD [ "serve", "-s", "dist", "-l", "3000" ]
