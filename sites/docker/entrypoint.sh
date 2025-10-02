#!/bin/bash

# Exit on any error
set -e

# Default values
BRANCH="main"
APP_NAME="my-app"
APPS=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --branch)
      BRANCH="$2"
      shift 2
      ;;
    --app-name)
      APP_NAME="$2"
      shift 2
      ;;
    --apps)
      APPS="$2"
      shift 2
      ;;
    *)
      echo "Unknown option $1"
      exit 1
      ;;
  esac
done

echo "🚀 Setting up Zodula project..."
echo "Branch: $BRANCH"
echo "App Name: $APP_NAME"
echo "Apps to install: $APPS"

# Create the Zodula project
echo "📦 Creating Zodula project..."
nailgun create $APP_NAME --branch $BRANCH

# Change to the project directory
cd $APP_NAME

# Install additional apps if provided
if [ -n "$APPS" ]; then
  echo "📦 Installing additional apps..."
  IFS=',' read -ra APP_ARRAY <<< "$APPS"
  for app in "${APP_ARRAY[@]}"; do
    app=$(echo "$app" | xargs) # trim whitespace
    if [ -n "$app" ]; then
      echo "Installing app: $app"
      nailgun install-app "$app"
    fi
  done
fi

# Run migrations
echo "🔄 Running migrations..."
nailgun migrate

# Start the application
echo "🚀 Starting Zodula application..."
nailgun start
