import React from 'react';
import { Stack } from 'expo-router';
import { colors, typography } from '../lib/styles';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.dark,
        headerTitleStyle: {
          fontWeight: typography.fontWeights.bold,
          fontSize: typography.fontSizes.lg,
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: 'Sign In',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: 'Create Account',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
