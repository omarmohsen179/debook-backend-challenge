#!/bin/bash

# Setup script for Debook Backend
# This script sets up everything needed to run the application

set -e

echo "🚀 Setting up Debook Backend..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker Desktop and try again."
  exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "📝 Creating .env file from .env.example..."
  cp .env.example .env
  echo "✅ .env file created"
else
  echo "✅ .env file already exists"
fi

# Build and start services
echo "🐳 Building and starting Docker containers..."
docker compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if PostgreSQL is healthy
echo "🔍 Checking PostgreSQL health..."
for i in {1..30}; do
  if docker compose exec -T postgres pg_isready -U debook_user > /dev/null 2>&1; then
    echo "✅ PostgreSQL is ready!"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "❌ PostgreSQL failed to start"
    exit 1
  fi
  sleep 1
done

# Wait a bit more for the app to start
echo "⏳ Waiting for application to start..."
sleep 10

# Check if app is running and healthy
echo "🔍 Checking application health..."
for i in {1..30}; do
  if docker compose ps app | grep -q "Up"; then
    # Try to connect to the API (try both common ports)
    if curl -s -f http://localhost:3000/v1/posts/test > /dev/null 2>&1; then
      echo "✅ Application is running and responding on port 3000!"
      break
    elif curl -s -f http://localhost:3001/v1/posts/test > /dev/null 2>&1; then
      echo "✅ Application is running and responding on port 3001!"
      break
    fi
  fi
  if [ $i -eq 30 ]; then
    echo "⚠️  Application might not be fully started yet. Check logs with: docker compose logs app"
    break
  fi
  sleep 2
done

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📊 Service Status:"
docker compose ps
echo ""
echo "📝 Next steps:"
echo "  - View logs: docker compose logs -f app"
echo "  - Run tests: ./test-all.sh (all tests run inside Docker)"
echo "  - API URL: http://localhost:${PORT:-3000}/v1"
echo ""
