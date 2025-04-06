import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../lib/styles';

type CardProps = {
  children: React.ReactNode;
  title?: string;
  style?: any;
  contentStyle?: any;
  fullWidth?: boolean;
};

export default function Card({ children, title, style, contentStyle, fullWidth = false }: CardProps) {
  return (
    <View style={[styles.card, fullWidth ? styles.fullWidth : styles.defaultWidth, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  defaultWidth: {
    width: '100%',
  },
  fullWidth: {
    width: '100%',
    marginHorizontal: 0,
    borderRadius: 0,
  },
  title: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.dark,
    marginBottom: spacing.md,
  },
  content: {
    width: '100%',
  },
});
