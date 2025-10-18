#!/usr/bin/env bash

# Usage:
# 1) SSH into EC2
# 2) Place this script on the EC2 host and run: sudo bash scripts/seed_ec2.sh
# This script will detect if the app is running in Docker and run the seeder inside the container,
# otherwise it attempts to run the Node seeder directly (requires node/npm installed on host).

CONTAINER_NAME="ntc-bus-tracking-api"

# Try to find running container
CID=$(docker ps --filter "name=$CONTAINER_NAME" --format "{{.ID}}")

if [ -n "$CID" ]; then
  echo "Found container $CONTAINER_NAME ($CID). Running seed inside container..."
  docker exec -i $CID sh -c "cd /app && node scripts/seed_db.js"
  exit $?
fi

# Not running in container - run locally on host
if command -v node >/dev/null 2>&1; then
  echo "Running seeder on host"
  NODE_ENV=production node scripts/seed_db.js
  exit $?
else
  echo "Node is not installed on host and container $CONTAINER_NAME not found."
  echo "Options: run this script inside your container, install node on host, or run via docker exec." 
  exit 2
fi
