#!/bin/bash

# Single command to setup and run everything
# Usage: ./run.sh [setup|test|all]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

case "${1:-all}" in
  setup)
    echo "🚀 Running setup..."
    bash setup.sh
    ;;
  test)
    echo "🧪 Running tests..."
    bash test-all.sh
    ;;
  all)
    echo "🚀 Setting up and testing everything..."
    bash setup.sh
    echo ""
    echo "⏳ Waiting for application to fully initialize..."
    sleep 5
    bash test-all.sh
    ;;
  *)
    echo "Usage: ./run.sh [setup|test|all]"
    echo "  setup - Setup Docker containers and environment"
    echo "  test  - Run all tests"
    echo "  all   - Setup and test everything (default)"
    exit 1
    ;;
esac
