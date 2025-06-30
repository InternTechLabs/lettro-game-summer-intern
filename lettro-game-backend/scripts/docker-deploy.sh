#!/bin/bash
# deploy.sh - Deploy application with environment-specific configuration

set -e

# Get the directory where this script is located
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Default to development if no environment is specified
ENV=${1:-development}

# Validate environment
if [[ ! "$ENV" =~ ^(development|staging|production)$ ]]; then
    echo "❌ Invalid environment. Please use: development, staging, or production"
    echo "Usage: $0 [development|staging|production]"
    exit 1
fi

echo "🚀 Deploying to $ENV environment..."

# Check if environment file exists
ENV_FILE="$PROJECT_ROOT/config/.env.${ENV}.local"
if [[ ! -f "$ENV_FILE" ]]; then
    echo "❌ Environment file not found: $ENV_FILE"
    echo "Please create the environment file first."
    exit 1
fi

# Export environment variable for docker-compose
export ENV=$ENV

# Load environment variables from the specific env file
echo "📋 Loading environment variables from $ENV_FILE"
set -o allexport
source "$ENV_FILE"
set +o allexport

# Shutdown existing containers
echo "🔄 Stopping existing containers..."
docker compose down

# Build and start containers
echo "🏗️  Building and starting containers for $ENV environment..."
if [[ "$ENV" == "development" ]]; then
    # In development, run in foreground with logs
    docker compose up --build
else
    # In staging/production, run in background
    docker compose up --build -d
    
    echo "✅ Containers are up and running for the $ENV environment."
    echo "📊 Container status:"
    docker compose ps
    
    # Show logs for a few seconds
    echo "📝 Recent logs:"
    timeout 10s docker compose logs --tail=20 || true
fi

echo "🎉 Deployment completed successfully!"
echo "🌐 Application URL: http://localhost:${APP_PORT}"