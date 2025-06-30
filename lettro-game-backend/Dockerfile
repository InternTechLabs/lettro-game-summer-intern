# Multi-stage Dockerfile for Node.js application
FROM node:20-alpine AS base

# Set working directory
WORKDIR /lettro-game

# Copy package files
COPY package*.json ./

# Install dependencies based on NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; then \
        npm ci; \
    else \
        npm ci --only=production && npm cache clean --force; \
    fi

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Development stage
FROM base AS development
# Ensure all dependencies are installed for development
RUN npm ci
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production
# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /lettro-game
USER nodejs

# Build the application
RUN npm run build

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })"

CMD ["npm", "start"]