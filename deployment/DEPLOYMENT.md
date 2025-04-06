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
