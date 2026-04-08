# Development Dockerfile for Vite + React + TypeScript
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies)
RUN npm install

# Copy the rest of your project
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev"]
