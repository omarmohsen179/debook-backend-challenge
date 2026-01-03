# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev --legacy-peer-deps

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Expose application port
EXPOSE 3000

# Health check - check if app responds (404 is OK, means app is running)
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/v1/posts/00000000-0000-0000-0000-000000000000', (r) => {process.exit([200, 404].includes(r.statusCode) ? 0 : 1)})"

# Start the application
CMD ["node", "dist/main"]
