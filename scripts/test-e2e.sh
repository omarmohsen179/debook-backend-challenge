#!/bin/bash

# Script to run E2E tests with Docker database

set -e

echo "🧪 Setting up E2E test environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker and try again."
  exit 1
fi

# Start PostgreSQL if not running
if ! docker ps | grep -q debook-postgres; then
  echo "📦 Starting PostgreSQL container..."
  docker-compose up -d postgres
  
  echo "⏳ Waiting for PostgreSQL to be ready..."
  sleep 5
  
  # Wait for database to be ready
  for i in {1..30}; do
    if docker-compose exec -T postgres pg_isready -U debook_user > /dev/null 2>&1; then
      echo "✅ PostgreSQL is ready!"
      break
    fi
    if [ $i -eq 30 ]; then
      echo "❌ PostgreSQL failed to start"
      exit 1
    fi
    sleep 1
  done
else
  echo "✅ PostgreSQL is already running"
fi

# Set environment variables for tests
export DATABASE_HOST=localhost
export DATABASE_PORT=5432
export DATABASE_USER=debook_user
export DATABASE_PASSWORD=debook_password
export DATABASE_NAME=debook_db

echo "🚀 Running E2E tests..."
npm run test:e2e

echo "✅ E2E tests completed!"
