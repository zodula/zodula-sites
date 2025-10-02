# Use Bun as the base image
FROM oven/bun:1 as base

# Set working directory
WORKDIR /app

# Install nailgun globally using bun
RUN bun install -g nailgun

# Create volumes for Zodula data
VOLUME ["/app/.zodula", "/app/.zodula_data", "/app/.zodula_backup"]

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose default Zodula port
EXPOSE 8000

# Set entrypoint
ENTRYPOINT ["/entrypoint.sh"]
