#!/bin/bash

# Test script for Workout Tracker app
# This script performs various tests to ensure the app is functioning correctly

echo "=== Starting Workout Tracker App Tests ==="
echo "Testing environment: $(date)"
echo ""

# Check if required files exist
echo "=== Testing file structure ==="
FILES_TO_CHECK=(
  "app/_layout.tsx"
  "app/(tabs)/_layout.tsx"
  "app/(auth)/_layout.tsx"
  "app/(tabs)/index.tsx"
  "app/(tabs)/workouts.tsx"
  "app/(tabs)/exercises.tsx"
  "app/(tabs)/profile.tsx"
  "app/(tabs)/explore.tsx"
  "app/workout/[id].tsx"
  "app/workout/[id]/start.tsx"
  "app/create-workout.tsx"
  "app/create-exercise.tsx"
  "lib/supabase.js"
  "lib/SupabaseContext.js"
  "lib/styles.ts"
  "components/Button.tsx"
  "components/Card.tsx"
  "components/Input.tsx"
  "components/Badge.tsx"
  "components/Progress.tsx"
  "components/Navigation.tsx"
)

MISSING_FILES=0
for file in "${FILES_TO_CHECK[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file exists"
  else
    echo "❌ $file is missing"
    MISSING_FILES=$((MISSING_FILES+1))
  fi
done

if [ $MISSING_FILES -eq 0 ]; then
  echo "✅ All required files are present"
else
  echo "❌ $MISSING_FILES files are missing"
fi
echo ""

# Check for Supabase configuration
echo "=== Testing Supabase configuration ==="
if grep -q "EXPO_PUBLIC_SUPABASE_URL" .env; then
  echo "✅ Supabase URL is configured"
else
  echo "❌ Supabase URL is not configured"
fi

if grep -q "EXPO_PUBLIC_SUPABASE_ANON_KEY" .env; then
  echo "✅ Supabase anonymous key is configured"
else
  echo "❌ Supabase anonymous key is not configured"
fi
echo ""

# Check for import path issues
echo "=== Testing import paths ==="
INCORRECT_IMPORTS=$(grep -r "from '../../lib/SupabaseContext'" app/ | wc -l)
if [ $INCORRECT_IMPORTS -eq 0 ]; then
  echo "✅ No incorrect import paths found"
else
  echo "❌ Found $INCORRECT_IMPORTS incorrect import paths"
  grep -r "from '../../lib/SupabaseContext'" app/
fi
echo ""

# Check UI components
echo "=== Testing UI components ==="
if grep -q "colors.primary" lib/styles.ts; then
  echo "✅ Design system colors are defined"
else
  echo "❌ Design system colors are not defined"
fi

if grep -q "typography.fontSizes" lib/styles.ts; then
  echo "✅ Typography system is defined"
else
  echo "❌ Typography system is not defined"
fi

if grep -q "spacing" lib/styles.ts; then
  echo "✅ Spacing system is defined"
else
  echo "❌ Spacing system is not defined"
fi
echo ""

# Check for navigation issues
echo "=== Testing navigation configuration ==="
if grep -q "title:" "app/(auth)/_layout.tsx"; then
  echo "✅ Auth navigation titles are properly configured"
else
  echo "❌ Auth navigation titles are not properly configured"
fi

if grep -q "title:" "app/(tabs)/_layout.tsx"; then
  echo "✅ Tab navigation titles are properly configured"
else
  echo "❌ Tab navigation titles are not properly configured"
fi
echo ""

# Check workout functionality
echo "=== Testing workout functionality ==="
if grep -q "startWorkout" "app/workout/[id].tsx"; then
  echo "✅ Workout detail screen has start workout functionality"
else
  echo "❌ Workout detail screen is missing start workout functionality"
fi

if grep -q "toggleSetCompletion" "app/workout/[id]/start.tsx"; then
  echo "✅ Workout session screen has set completion tracking"
else
  echo "❌ Workout session screen is missing set completion tracking"
fi

if grep -q "saveWorkoutLog" "app/workout/[id]/start.tsx"; then
  echo "✅ Workout session screen has workout logging functionality"
else
  echo "❌ Workout session screen is missing workout logging functionality"
fi
echo ""

# Summary
echo "=== Test Summary ==="
echo "File structure: $([ $MISSING_FILES -eq 0 ] && echo "✅ Pass" || echo "❌ Fail")"
echo "Supabase configuration: $(grep -q "EXPO_PUBLIC_SUPABASE" .env && echo "✅ Pass" || echo "❌ Fail")"
echo "Import paths: $([ $INCORRECT_IMPORTS -eq 0 ] && echo "✅ Pass" || echo "❌ Fail")"
echo "UI components: $(grep -q "colors.primary" lib/styles.ts && echo "✅ Pass" || echo "❌ Fail")"
echo "Navigation configuration: $(grep -q "title:" "app/(tabs)/_layout.tsx" && echo "✅ Pass" || echo "❌ Fail")"
echo "Workout functionality: $(grep -q "toggleSetCompletion" "app/workout/[id]/start.tsx" && echo "✅ Pass" || echo "❌ Fail")"
echo ""

echo "=== Tests completed ==="
