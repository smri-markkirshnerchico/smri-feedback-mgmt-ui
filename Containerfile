# Note: This Dockerfile assumes you have set 'output: "standalone"' in your next.config.js for best results.
# --- USING AZURE LINUX BASE IMAGE ---

# Stage 0: Base Image Setup (Common base for dependencies and build)
FROM mcr.microsoft.com/azurelinux/base/nodejs:20 AS base
WORKDIR /app

# The UBI image might not have corepack set up, so we install Yarn globally using npm for reliability.
# RUN npm install -g yarn

# Install dependencies only when needed
FROM base AS deps
# Copy only the files necessary for dependency resolution
COPY package.json yarn.lock ./
# Uncomment the lines below if you use private registries or specific configurations
# COPY .npmrc ./
# COPY .yarnrc ./

# Install dependencies using Yarn
# --frozen-lockfile ensures deterministic builds
# RUN yarn install --frozen-lockfile
RUN npm install --frozen-lockfile

# Stage 1: Build the application
FROM base AS builder
WORKDIR /app

# Copy necessary files and installed dependencies from the dependency stage
COPY --from=deps /app/node_modules ./node_modules
COPY src/ ./src
COPY public/ ./public
COPY next.config.mjs ./
COPY tsconfig.json ./
COPY package.json ./


# Pass build arguments and set public environment variables
ARG API_SERVER_URL
ENV NEXT_PUBLIC_SERVER_URL=${API_SERVER_URL}
ENV NEXT_PUBLIC_APP_CODE='Core'
ENV NEXT_PUBLIC_MODULE_CODE='Core'
ENV NEXT_PUBLIC_DOMAIN_URL='.smretailinc.intranet' 
ENV NEXT_PUBLIC_ICONIFY_URL=https://cs-iconify.smretailinc.com

# Run the Next.js build using Yarn
# This generates the optimized application bundle in .next/standalone
RUN set -ex && npm run build

# Stage 2: Production Runtime Image (Slim, Secure, and UBI-based)
FROM mcr.microsoft.com/azurelinux/base/nodejs:20 AS runner

RUN tdnf makecache && \
    tdnf clean all

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy the standalone server and static assets from the builder stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE ${PORT}

# Set host and command for running the standalone Next.js server
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]