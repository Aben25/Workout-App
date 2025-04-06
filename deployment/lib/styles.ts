import { StyleSheet } from 'react-native';

// Color palette
export const colors = {
  primary: '#3498db',
  primaryDark: '#2980b9',
  secondary: '#27ae60',
  secondaryDark: '#219653',
  accent: '#f39c12',
  danger: '#e74c3c',
  background: '#f5f5f5',
  card: '#ffffff',
  text: '#333333',
  textLight: '#666666',
  textMuted: '#999999',
  border: '#dddddd',
  success: '#2ecc71',
  warning: '#f1c40f',
  info: '#3498db',
  error: '#e74c3c',
};

// Typography
export const typography = {
  fontSizeSmall: 12,
  fontSizeRegular: 14,
  fontSizeMedium: 16,
  fontSizeLarge: 18,
  fontSizeXLarge: 20,
  fontSizeXXLarge: 24,
  fontSizeTitle: 28,
  fontWeightLight: '300',
  fontWeightRegular: '400',
  fontWeightMedium: '500',
  fontWeightBold: '700',
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
};

// Shadows
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
};

// Common styles
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSizeTitle,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.fontSizeXLarge,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSizeLarge,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  text: {
    fontSize: typography.fontSizeRegular,
    color: colors.text,
  },
  textMuted: {
    fontSize: typography.fontSizeRegular,
    color: colors.textMuted,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.card,
    fontSize: typography.fontSizeMedium,
    fontWeight: typography.fontWeightMedium,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.fontSizeRegular,
    color: colors.text,
  },
  inputLabel: {
    fontSize: typography.fontSizeRegular,
    fontWeight: typography.fontWeightMedium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: typography.fontSizeSmall,
    fontWeight: typography.fontWeightMedium,
  },
});

// Difficulty badge styles
export const difficultyStyles = {
  beginner: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  },
  intermediate: {
    backgroundColor: '#fff8e1',
    color: '#f57f17',
  },
  advanced: {
    backgroundColor: '#ffebee',
    color: '#c62828',
  },
};

// Muscle group badge styles
export const muscleGroupStyles = {
  chest: { backgroundColor: '#e3f2fd', color: '#1565c0' },
  back: { backgroundColor: '#e8f5e9', color: '#2e7d32' },
  shoulders: { backgroundColor: '#f3e5f5', color: '#7b1fa2' },
  arms: { backgroundColor: '#e8eaf6', color: '#303f9f' },
  legs: { backgroundColor: '#fff3e0', color: '#e65100' },
  core: { backgroundColor: '#fce4ec', color: '#c2185b' },
  cardio: { backgroundColor: '#e0f2f1', color: '#00695c' },
};
