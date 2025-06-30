#!/bin/bash
# scripts/docker-utils.sh - Utility functions for Docker management

# Stop containers for specific environment
stop_env() {
    local env=${1:-development}
    echo "🛑 Stopping $env environment..."
    ENV=$env docker compose down
}

# View logs for specific environment
logs_env() {
    local env=${1:-development}
    local service=${2:-app}
    echo "📝 Showing logs for $service in $env environment..."
    ENV=$env docker compose logs -f $service
}

# Execute command in app container
exec_app() {
    local env=${1:-development}
    shift
    local cmd=${@:-/bin/sh}
    echo "🔧 Executing command in $env app container: $cmd"
    ENV=$env docker compose exec app $cmd
}

# Database shell
db_shell() {
    local env=${1:-development}
    echo "🗄️  Connecting to $env database..."
    ENV=$env docker compose exec postgres psql -U lettro -d lettro_${env}
}

# Redis shell
redis_shell() {
    local env=${1:-development}
    echo "🔴 Connecting to $env Redis..."
    ENV=$env docker compose exec redis redis-cli
}

# Show usage
usage() {
    echo "Docker Utility Functions:"
    echo "  stop_env [env]           - Stop environment containers"
    echo "  logs_env [env] [service] - Show logs for service"
    echo "  exec_app [env] [command] - Execute command in app container"
    echo "  db_shell [env]           - Connect to database shell"
    echo "  redis_shell [env]        - Connect to Redis shell"
    echo ""
    echo "Environments: development (default), staging, production"
}

# If script is called directly, show usage
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    usage
fi

# ---

#!/bin/bash
# scripts/setup-env.sh - Setup environment files

create_env_files() {
    local config_dir="config"
    
    # Create config directory if it doesn't exist
    mkdir -p "$config_dir"
    
    echo "📁 Creating environment configuration files in $config_dir/"
    
    # The environment files content is already provided above
    # This script would create them if they don't exist
    
    for env in development staging production; do
        local env_file="$config_dir/.env.${env}.local"
        if [[ ! -f "$env_file" ]]; then
            echo "📝 Creating $env_file"
            # You would copy the appropriate content here
        else
            echo "✅ $env_file already exists"
        fi
    done
}

# ---

#!/bin/bash
# scripts/health-check.sh - Check health of services

health_check() {
    local env=${1:-development}
    
    echo "🏥 Health check for $env environment:"
    
    # Set environment
    export ENV=$env
    
    # Check if containers are running
    echo "📊 Container status:"
    docker compose ps
    
    echo ""
    echo "🔍 Service health:"
    
    # Check app health
    local app_port=$(grep "APP_PORT" "config/.env.${env}.local" | cut -d'=' -f2)
    if curl -s -o /dev/null -w "%{http_code}" "http://localhost:${app_port}/health" | grep -q "200"; then
        echo "✅ App service: Healthy"
    else
        echo "❌ App service: Unhealthy"
    fi
    
    # Check database
    if ENV=$env docker compose exec -T postgres pg_isready -q; then
        echo "✅ Database service: Healthy"
    else
        echo "❌ Database service: Unhealthy"
    fi
    
    # Check Redis
    if ENV=$env docker compose exec -T redis redis-cli ping | grep -q "PONG"; then
        echo "✅ Redis service: Healthy"
    else
        echo "❌ Redis service: Unhealthy"
    fi
}