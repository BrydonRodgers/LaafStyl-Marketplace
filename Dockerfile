# Development stage with full dependencies
FROM node:20-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy source
COPY . .

# Expose port
EXPOSE 3000

# Use dumb-init to run Node
ENTRYPOINT ["dumb-init", "--"]
# Run in development mode with next dev
CMD ["npm", "run", "dev"]
