import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../lib/styles';
import { FontAwesome } from '@expo/vector-icons';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: any;
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  // Determine button styles based on variant
  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? colors.lightGray : colors.primary,
          borderColor: colors.primary,
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? colors.lightGray : colors.secondary,
          borderColor: colors.secondary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: disabled ? colors.lightGray : colors.primary,
          borderWidth: 1,
        };
      case 'danger':
        return {
          backgroundColor: disabled ? colors.lightGray : colors.danger,
          borderColor: colors.danger,
        };
      default:
        return {
          backgroundColor: disabled ? colors.lightGray : colors.primary,
          borderColor: colors.primary,
        };
    }
  };

  // Determine text color based on variant
  const getTextColor = () => {
    if (disabled) return colors.gray;
    
    switch (variant) {
      case 'outline':
        return colors.primary;
      default:
        return colors.card;
    }
  };

  // Determine padding based on size
  const getPadding = () => {
    switch (size) {
      case 'small':
        return spacing.sm;
      case 'large':
        return spacing.lg;
      default:
        return spacing.md;
    }
  };

  // Determine font size based on size
  const getFontSize = () => {
    switch (size) {
      case 'small':
        return typography.fontSizes.sm;
      case 'large':
        return typography.fontSizes.lg;
      default:
        return typography.fontSizes.md;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        getButtonStyles(),
        { padding: getPadding() },
        fullWidth && styles.fullWidth,
        style,
      ]}
      activeOpacity={0.8}
    >
      <View style={styles.buttonContent}>
        {icon && (
          <FontAwesome
            name={icon}
            size={getFontSize() + 2}
            color={getTextColor()}
            style={styles.icon}
          />
        )}
        <Text
          style={[
            styles.buttonText,
            { color: getTextColor(), fontSize: getFontSize() },
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  fullWidth: {
    width: '100%',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: typography.fontWeights.medium,
    textAlign: 'center',
  },
  icon: {
    marginRight: spacing.sm,
  },
});
