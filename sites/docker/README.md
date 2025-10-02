# Zodula Docker Setup

This directory contains Docker configuration for spinning up a Zodula project instance with apps as input.

## Files

- `Dockerfile` - Main Docker configuration
- `entrypoint.sh` - Script to handle project creation and app installation
- `docker-compose.yml` - Docker Compose configuration for easy deployment
- `README.md` - This documentation

## Usage

### Using Docker directly (Simple approach)

1. **Build the image:**
   ```bash
   docker build -t zodula-project .
   ```

2. **Run the container:**
   ```bash
   docker run -p 8000:8000 \
     -v zodula_data:/app/.zodula \
     -v zodula_backup:/app/.zodula_backup \
     -v zodula_config:/app/.zodula_data \
     zodula-project \
     --branch main \
     --app-name my-app \
     --apps "app1,app2,app3"
   ```

### Using Docker Compose (Optional - for easier management)

1. **Set environment variables:**
   ```bash
   export BRANCH="main"  # or your desired branch
   export APP_NAME="my-zodula-app"
   export APPS="app1,app2,app3"  # comma-separated list of apps to install
   ```

2. **Build and run:**
   ```bash
   docker-compose up --build
   ```

## What the Docker setup does

1. **Installs nailgun globally** using Bun
2. **Creates a Zodula project** with `nailgun create <app-name> --branch <branch>`
3. **Installs additional apps** by looping through the provided apps list with `nailgun install-app <app>`
4. **Runs migrations** with `nailgun migrate`
5. **Starts the application** with `nailgun start`

## Volumes

The setup creates three persistent volumes:
- `.zodula` - Main Zodula configuration and data
- `.zodula_data` - Application data
- `.zodula_backup` - Backup data

## Environment Variables

- `BRANCH` - Git branch to use for the project (default: "main")
- `APP_NAME` - Name of the Zodula app (default: "my-app")
- `APPS` - Comma-separated list of apps to install (optional)

## Ports

The application runs on port 8000 by default.
