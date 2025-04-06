#!/bin/bash

# Deployment script for workout app
echo "Starting workout app deployment process..."

# Create build directory
mkdir -p /home/ubuntu/workout-tracker/build
cd /home/ubuntu/workout-tracker

# Install required dependencies for deployment
echo "Installing deployment dependencies..."
npm install --save-dev eas-cli

# Create app.json configuration for deployment
echo "Configuring app.json for deployment..."
cat > /home/ubuntu/workout-tracker/app.json << 'EOL'
{
  "expo": {
    "name": "Workout Tracker",
    "slug": "workout-tracker",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#3498db"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.workout.tracker"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#3498db"
      },
      "package": "com.workout.tracker"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "workout-tracker"
      }
    }
  }
}
EOL

# Create eas.json configuration
echo "Creating EAS build configuration..."
cat > /home/ubuntu/workout-tracker/eas.json << 'EOL'
{
  "cli": {
    "version": ">= 3.13.3"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
EOL

# Create .env.production file
echo "Creating production environment configuration..."
cat > /home/ubuntu/workout-tracker/.env.production << 'EOL'
EXPO_PUBLIC_SUPABASE_URL='https://xtazgqpcaujwwaswzeoh.supabase.co'
EXPO_PUBLIC_SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0YXpncXBjYXVqd3dhc3d6ZW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4MTA5MDUsImV4cCI6MjA0NzM4NjkwNX0.nFutcV81_Na8L-wwxFRpYg7RhqmjMrYspP2LyKbE_q0'
EOL

# Create web build
echo "Building web version of the app..."
npm run build:web || echo "Web build command not available, skipping..."

# Create deployment README
echo "Creating deployment documentation..."
cat > /home/ubuntu/workout-tracker/DEPLOYMENT.md << 'EOL'
# Workout Tracker App Deployment Guide

This document provides instructions for deploying the Workout Tracker app to various platforms.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)
- Expo account (create one at https://expo.dev/signup)

## Environment Variables

The app requires the following environment variables:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These are already configured in the `.env.production` file for the production environment.

## Deployment Options

### 1. Expo Go (Development/Testing)

For quick testing on physical devices:

```bash
# Start the Expo development server
npx expo start
```

Then scan the QR code with the Expo Go app on your device.

### 2. Web Deployment

To deploy the web version:

```bash
# Build the web version
npx expo export:web

# The build will be available in the 'web-build' directory
# You can deploy this to any static hosting service like Netlify, Vercel, or GitHub Pages
```

### 3. Native App Builds with EAS

To create native builds for iOS and Android:

```bash
# Log in to your Expo account
eas login

# Configure the project
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

### 4. Publishing Updates

To publish updates to your app:

```bash
# Publish an update
eas update --branch production
```

## Supabase Configuration

The app uses Supabase for backend services. Make sure your Supabase project has:

1. Authentication enabled with email/password sign-in
2. Database tables created according to the schema
3. Row-level security policies configured
4. Storage buckets set up if needed

## Troubleshooting

If you encounter issues during deployment:

1. Check that all environment variables are correctly set
2. Verify that your Supabase project is properly configured
3. Ensure you have the necessary permissions for app store submissions
4. Check the Expo and EAS documentation for platform-specific requirements

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Supabase Documentation](https://supabase.com/docs)
EOL

# Create a production build script
echo "Creating production build script..."
cat > /home/ubuntu/workout-tracker/build.sh << 'EOL'
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
EOL

chmod +x /home/ubuntu/workout-tracker/build.sh

# Create a deployment package
echo "Creating deployment package..."
mkdir -p /home/ubuntu/workout-tracker/deployment
cp -r /home/ubuntu/workout-tracker/app /home/ubuntu/workout-tracker/deployment/
cp -r /home/ubuntu/workout-tracker/assets /home/ubuntu/workout-tracker/deployment/
cp -r /home/ubuntu/workout-tracker/components /home/ubuntu/workout-tracker/deployment/
cp -r /home/ubuntu/workout-tracker/lib /home/ubuntu/workout-tracker/deployment/
cp -r /home/ubuntu/workout-tracker/migrations /home/ubuntu/workout-tracker/deployment/
cp /home/ubuntu/workout-tracker/app.json /home/ubuntu/workout-tracker/deployment/
cp /home/ubuntu/workout-tracker/eas.json /home/ubuntu/workout-tracker/deployment/
cp /home/ubuntu/workout-tracker/package.json /home/ubuntu/workout-tracker/deployment/
cp /home/ubuntu/workout-tracker/.env.production /home/ubuntu/workout-tracker/deployment/
cp /home/ubuntu/workout-tracker/DEPLOYMENT.md /home/ubuntu/workout-tracker/deployment/
cp /home/ubuntu/workout-tracker/build.sh /home/ubuntu/workout-tracker/deployment/

# Create a zip file of the deployment package
cd /home/ubuntu/workout-tracker
zip -r workout-tracker-deployment.zip deployment

echo "Deployment preparation complete!"
echo "Deployment package created at: /home/ubuntu/workout-tracker/workout-tracker-deployment.zip"
echo "Follow instructions in DEPLOYMENT.md to complete the deployment process."
