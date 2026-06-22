#!/bin/bash
# DEPLOY.sh - Deploy to GitHub Pages with ngrok tunnel

set -e

if [ -z "$1" ]; then
  echo "Usage: ./DEPLOY.sh <ngrok_url>"
  echo "Example: ./DEPLOY.sh https://1234-567-890-123-456.ngrok.io"
  exit 1
fi

NGROK_URL="$1"

echo "Deploying with ngrok URL: $NGROK_URL"

# Update .env.local with ngrok URL
echo "Updating .env.local..."
sed -i "s|https://placeholder.ngrok.io|$NGROK_URL|g" .env.local

# Display current config
echo "Current API URL in .env.local:"
grep NEXT_PUBLIC_API_URL .env.local

# Build the project
echo "Building project..."
npm run build

# Stage changes
echo "Staging changes..."
git add .

# Commit with ngrok URL
echo "Committing changes..."
git commit -m "Deploy with ngrok tunnel: $NGROK_URL"

# Push to main
echo "Pushing to main branch..."
git push origin main

echo "Deployment complete!"
echo "API URL: $NGROK_URL"
