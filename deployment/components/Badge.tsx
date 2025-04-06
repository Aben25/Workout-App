import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borderRadius, difficultyStyles, muscleGroupStyles } from '../lib/styles';
import { FontAwesome } from '@expo/vector-icons';

// Badge variants
export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

// Badge sizes
export type BadgeSize = 'small' | 'medium' | 'large';

// Badge props
interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: string;
  onPress?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'default',
  size = 'medium',
  icon,
  onPress,
}) => {
  // Get badge style based on variant
  const getBadgeStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryBadge;
      case 'secondary':
        return styles.secondaryBadge;
      case 'success':
        return styles.successBadge;
      case 'warning':
        return styles.warningBadge;
      case 'danger':
        return styles.dangerBadge;
      case 'info':
        return styles.infoBadge;
      default:
        return styles.defaultBadge;
    }
  };

  // Get text style based on variant
  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'success':
        return styles.successText;
      case 'warning':
        return styles.warningText;
      case 'danger':
        return styles.dangerText;
      case 'info':
        return styles.infoText;
      default:
        return styles.defaultText;
    }
  };

  // Get badge size style
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallBadge;
      case 'large':
        return styles.largeBadge;
      default:
        return styles.mediumBadge;
    }
  };

  // Get text size style
  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallText;
      case 'large':
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  // Get icon size based on badge size
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 10;
      case 'large':
        return 16;
      default:
        return 12;
    }
  };

  const BadgeComponent = onPress ? TouchableOpacity : View;

  return (
    <BadgeComponent
      style={[styles.badge, getBadgeStyle(), getSizeStyle()]}
      onPress={onPress}
      disabled={!onPress}
    >
      {icon && (
        <FontAwesome
          name={icon}
          size={getIconSize()}
          color={getTextStyle().color}
          style={styles.icon}
        />
      )}
      <Text style={[styles.text, getTextStyle(), getTextSizeStyle()]}>{text}</Text>
    </BadgeComponent>
  );
};

// Difficulty badge component
interface DifficultyBadgeProps {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  size?: BadgeSize;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty, size = 'medium' }) => {
  const style = difficultyStyles[difficulty];
  
  return (
    <View style={[
      styles.badge,
      { backgroundColor: style.backgroundColor },
      size === 'small' ? styles.smallBadge : size === 'large' ? styles.largeBadge : styles.mediumBadge
    ]}>
      <Text style={[
        styles.text,
        { color: style.color },
        size === 'small' ? styles.smallText : size === 'large' ? styles.largeText : styles.mediumText
      ]}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </Text>
    </View>
  );
};

// Muscle group badge component
interface MuscleGroupBadgeProps {
  muscleGroup: 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'core' | 'cardio';
  size?: BadgeSize;
}

export const MuscleGroupBadge: React.FC<MuscleGroupBadgeProps> = ({ muscleGroup, size = 'medium' }) => {
  const style = muscleGroupStyles[muscleGroup];
  
  return (
    <View style={[
      styles.badge,
      { backgroundColor: style.backgroundColor },
      size === 'small' ? styles.smallBadge : size === 'large' ? styles.largeBadge : styles.mediumBadge
    ]}>
      <Text style={[
        styles.text,
        { color: style.color },
        size === 'small' ? styles.smallText : size === 'large' ? styles.largeText : styles.mediumText
      ]}>
        {muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.sm,
  },
  smallBadge: {
    paddingVertical: 2,
  },
  mediumBadge: {
    paddingVertical: 4,
  },
  largeBadge: {
    paddingVertical: 6,
  },
  defaultBadge: {
    backgroundColor: colors.border,
  },
  primaryBadge: {
    backgroundColor: '#e3f2fd',
  },
  secondaryBadge: {
    backgroundColor: '#e8f5e9',
  },
  successBadge: {
    backgroundColor: '#e8f5e9',
  },
  warningBadge: {
    backgroundColor: '#fff8e1',
  },
  dangerBadge: {
    backgroundColor: '#ffebee',
  },
  infoBadge: {
    backgroundColor: '#e3f2fd',
  },
  text: {
    fontWeight: typography.fontWeightMedium,
  },
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 12,
  },
  largeText: {
    fontSize: 14,
  },
  defaultText: {
    color: colors.textLight,
  },
  primaryText: {
    color: '#1565c0',
  },
  secondaryText: {
    color: '#2e7d32',
  },
  successText: {
    color: '#2e7d32',
  },
  warningText: {
    color: '#f57f17',
  },
  dangerText: {
    color: '#c62828',
  },
  infoText: {
    color: '#1565c0',
  },
  icon: {
    marginRight: 4,
  },
});
