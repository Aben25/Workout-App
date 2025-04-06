import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../lib/styles';

type BadgeProps = {
  text: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'small' | 'medium' | 'large';
  style?: any;
};

export default function Badge({ text, variant = 'primary', size = 'medium', style }: BadgeProps) {
  // Get background color based on variant
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'success':
        return colors.secondary;
      case 'warning':
        return colors.warning;
      case 'danger':
        return colors.danger;
      case 'info':
        return colors.accent;
      default:
        return colors.primary;
    }
  };

  // Get text color (always white for now, but could be customized)
  const getTextColor = () => {
    return '#ffffff';
  };

  // Get padding based on size
  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: spacing.xs / 2, paddingHorizontal: spacing.sm };
      case 'large':
        return { paddingVertical: spacing.sm, paddingHorizontal: spacing.md };
      default:
        return { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm };
    }
  };

  // Get font size based on size
  const getFontSize = () => {
    switch (size) {
      case 'small':
        return typography.fontSizes.xs;
      case 'large':
        return typography.fontSizes.md;
      default:
        return typography.fontSizes.sm;
    }
  };

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: getBackgroundColor() },
        getPadding(),
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: getTextColor(), fontSize: getFontSize() },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

// Badge specifically for workout difficulty
export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const getVariant = () => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'danger';
      default:
        return 'info';
    }
  };

  return (
    <Badge
      text={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      variant={getVariant()}
      size="small"
    />
  );
}

// Badge specifically for muscle groups
export function MuscleGroupBadge({ muscleGroup }: { muscleGroup: string }) {
  return (
    <Badge
      text={muscleGroup}
      variant="info"
      size="small"
      style={styles.muscleGroupBadge}
    />
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: borderRadius.round,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: typography.fontWeights.medium,
  },
  muscleGroupBadge: {
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
});
