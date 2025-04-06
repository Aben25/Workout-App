import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../lib/styles';

type NavigationItemProps = {
  label: string;
  icon: string;
  isActive?: boolean;
  onPress: () => void;
};

export function NavigationItem({ label, icon, isActive = false, onPress }: NavigationItemProps) {
  return (
    <TouchableOpacity 
      style={styles.navItem} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <FontAwesome 
        name={icon} 
        size={24} 
        color={isActive ? colors.primary : colors.gray} 
      />
      <Text 
        style={[
          styles.navLabel,
          isActive && styles.activeNavLabel
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

type EmptyStateProps = {
  icon: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon, title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.emptyStateContainer}>
      <FontAwesome name={icon} size={48} color={colors.lightGray} />
      <Text style={styles.emptyStateTitle}>{title}</Text>
      <Text style={styles.emptyStateMessage}>{message}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity style={styles.emptyStateAction} onPress={onAction}>
          <Text style={styles.emptyStateActionText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

type ListItemProps = {
  title: string;
  subtitle?: string;
  rightText?: string;
  icon?: string;
  onPress?: () => void;
  rightIcon?: string;
  onRightIconPress?: () => void;
};

export function ListItem({ 
  title, 
  subtitle, 
  rightText, 
  icon, 
  onPress, 
  rightIcon,
  onRightIconPress
}: ListItemProps) {
  return (
    <TouchableOpacity 
      style={styles.listItem}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.listItemContent}>
        {icon && (
          <View style={styles.listItemIconContainer}>
            <FontAwesome name={icon} size={20} color={colors.primary} />
          </View>
        )}
        <View style={styles.listItemTextContainer}>
          <Text style={styles.listItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.listItemSubtitle}>{subtitle}</Text>}
        </View>
        <View style={styles.listItemRight}>
          {rightText && <Text style={styles.listItemRightText}>{rightText}</Text>}
          {rightIcon && (
            <TouchableOpacity 
              onPress={onRightIconPress} 
              disabled={!onRightIconPress}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <FontAwesome name={rightIcon} size={16} color={colors.gray} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

type SectionHeaderProps = {
  title: string;
  rightText?: string;
  onRightTextPress?: () => void;
};

export function SectionHeader({ title, rightText, onRightTextPress }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderTitle}>{title}</Text>
      {rightText && (
        <TouchableOpacity onPress={onRightTextPress} disabled={!onRightTextPress}>
          <Text style={styles.sectionHeaderRight}>{rightText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Navigation Item
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  navLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.gray,
    marginTop: spacing.xs / 2,
  },
  activeNavLabel: {
    color: colors.primary,
    fontWeight: typography.fontWeights.medium,
  },
  
  // Empty State
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyStateTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.dark,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptyStateMessage: {
    fontSize: typography.fontSizes.md,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  emptyStateAction: {
    marginTop: spacing.md,
  },
  emptyStateActionText: {
    fontSize: typography.fontSizes.md,
    color: colors.primary,
    fontWeight: typography.fontWeights.medium,
  },
  
  // List Item
  listItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemIconContainer: {
    marginRight: spacing.md,
  },
  listItemTextContainer: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.dark,
  },
  listItemSubtitle: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray,
    marginTop: spacing.xs / 2,
  },
  listItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemRightText: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray,
    marginRight: spacing.sm,
  },
  
  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  sectionHeaderTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.dark,
  },
  sectionHeaderRight: {
    fontSize: typography.fontSizes.sm,
    color: colors.primary,
  },
});
