# GitHub Push Instructions for Workout App

This document provides instructions for pushing the Workout App code to your GitHub repository.

## Option 1: Push from Your Local Machine

1. **Clone your repository**:
   ```bash
   git clone https://github.com/Aben25/Workout-App.git
   cd Workout-App
   ```

2. **Download and extract the workout app code** from the zip file I provided.

3. **Copy all files** to your cloned repository folder.

4. **Add, commit, and push the changes**:
   ```bash
   git add .
   git commit -m "Initial commit: Complete workout app with Expo and Supabase"
   git push
   ```

## Option 2: Create a New Personal Access Token

1. **Go to GitHub Settings**:
   - Click on your profile picture in the top right
   - Select "Settings"
   - Select "Developer settings" from the left sidebar
   - Select "Personal access tokens" > "Tokens (classic)"

2. **Generate a new token**:
   - Click "Generate new token"
   - Give it a descriptive name like "Workout App Push"
   - Select the following scopes:
     - `repo` (Full control of private repositories)
     - `workflow` (if you plan to use GitHub Actions)
   - Click "Generate token"
   - Copy the token immediately (you won't be able to see it again)

3. **Use the token for git operations**:
   ```bash
   git remote set-url origin https://YOUR_USERNAME:YOUR_NEW_TOKEN@github.com/Aben25/Workout-App.git
   git push -u origin main
   ```

## Option 3: Set Up SSH Authentication

For more secure and convenient ongoing development:

1. **Generate an SSH key** (if you don't already have one):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. **Add the SSH key to your GitHub account**:
   - Copy your public key: `cat ~/.ssh/id_ed25519.pub`
   - Go to GitHub Settings > SSH and GPG keys
   - Click "New SSH key"
   - Paste your key and save

3. **Change your repository remote to use SSH**:
   ```bash
   git remote set-url origin git@github.com:Aben25/Workout-App.git
   git push -u origin main
   ```

## Repository Structure

The workout app repository contains:

- `/app`: Main application code with screens and navigation
- `/components`: Reusable UI components
- `/lib`: Utility functions and Supabase integration
- `/migrations`: Database schema and migrations
- `/assets`: Images, fonts, and other static assets
- `/tests`: Test files and components

## Next Steps After Pushing

1. **Set up GitHub Pages** (optional):
   - Go to repository Settings > Pages
   - Select the main branch and /docs folder
   - This will host the web version of your app

2. **Set up GitHub Actions** (optional):
   - Create workflows for CI/CD
   - Automate testing and deployment

3. **Protect your main branch** (recommended):
   - Go to Settings > Branches
   - Add a branch protection rule for main
   - Require pull request reviews before merging

Let me know if you need any clarification or assistance with these steps!
