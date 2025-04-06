import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../lib/styles';

// Progress bar variants
export type ProgressBarVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

// Progress bar props
interface ProgressBarProps {
  progress: number; // 0 to 1
  variant?: ProgressBarVariant;
  height?: number;
  showPercentage?: boolean;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  variant = 'primary',
  height = 10,
  showPercentage = false,
  label,
}) => {
  // Ensure progress is between 0 and 1
  const normalizedProgress = Math.min(Math.max(progress, 0), 1);
  
  // Get progress bar color based on variant
  const getProgressColor = () => {
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'danger':
        return colors.danger;
      default:
        return colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.progressContainer, { height }]}>
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${normalizedProgress * 100}%`,
              backgroundColor: getProgressColor(),
              height
            }
          ]} 
        />
      </View>
      {showPercentage && (
        <Text style={styles.percentage}>{Math.round(normalizedProgress * 100)}%</Text>
      )}
    </View>
  );
};

// Loading spinner props
interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = colors.primary,
  text,
  fullScreen = false,
}) => {
  return (
    <View style={[styles.spinnerContainer, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.spinnerText}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  label: {
    fontSize: typography.fontSizeRegular,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  progressContainer: {
    backgroundColor: colors.border,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: borderRadius.round,
  },
  percentage: {
    fontSize: typography.fontSizeSmall,
    color: colors.textLight,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
  spinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  spinnerText: {
    marginTop: spacing.sm,
    fontSize: typography.fontSizeRegular,
    color: colors.textLight,
  },
});
