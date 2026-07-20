#!/bin/sh
set -e

export PATH="/app/node_modules/.bin:$PATH"

echo "Running Prisma migrations..."
prisma migrate deploy

echo "Seeding database..."
prisma db seed

echo "Starting app..."
exec node server.js
