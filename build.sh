#!/bin/bash

# Production build script
echo "Building production version of Workout Tracker app..."

# Install dependencies
npm install

# Build for web
echo "Building web version..."
npx expo export:web

# Prepare for EAS builds
echo "Preparing for native builds..."
npx eas-cli build:configure

echo "Build process completed!"
echo "To deploy to app stores, run: npx eas build --platform all"
echo "To deploy web version, upload the web-build directory to your hosting provider"
