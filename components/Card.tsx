import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../lib/styles';

// Card variants
export type CardVariant = 'default' | 'elevated' | 'outlined';

// Card props
interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  variant?: CardVariant;
  style?: object;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  variant = 'default',
  style,
}) => {
  // Get card style based on variant
  const getCardStyle = () => {
    switch (variant) {
      case 'elevated':
        return styles.elevatedCard;
      case 'outlined':
        return styles.outlinedCard;
      default:
        return styles.defaultCard;
    }
  };

  return (
    <View style={[styles.card, getCardStyle(), style]}>
      {(title || subtitle) && (
        <View style={styles.cardHeader}>
          {title && <Text style={styles.cardTitle}>{title}</Text>}
          {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
        </View>
      )}
      <View style={styles.cardContent}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  defaultCard: {
    backgroundColor: colors.card,
    ...shadows.small,
  },
  elevatedCard: {
    backgroundColor: colors.card,
    ...shadows.medium,
  },
  outlinedCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cardTitle: {
    fontSize: typography.fontSizeLarge,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
  },
  cardSubtitle: {
    fontSize: typography.fontSizeRegular,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  cardContent: {
    padding: spacing.md,
  },
});
