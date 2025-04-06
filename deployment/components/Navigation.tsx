import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../lib/styles';
import { FontAwesome } from '@expo/vector-icons';

// Tab item interface
interface TabItem {
  key: string;
  label: string;
  icon?: string;
}

// Tab bar props
interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabKey: string) => void;
  variant?: 'default' | 'pills' | 'underlined';
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
}) => {
  // Get tab style based on variant
  const getTabStyle = (isActive: boolean) => {
    switch (variant) {
      case 'pills':
        return isActive ? styles.activePillTab : styles.inactivePillTab;
      case 'underlined':
        return isActive ? styles.activeUnderlinedTab : styles.inactiveUnderlinedTab;
      default:
        return isActive ? styles.activeTab : styles.inactiveTab;
    }
  };

  // Get text style based on active state
  const getTextStyle = (isActive: boolean) => {
    return isActive ? styles.activeTabText : styles.inactiveTabText;
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, getTabStyle(isActive)]}
              onPress={() => onTabChange(tab.key)}
            >
              {tab.icon && (
                <FontAwesome
                  name={tab.icon}
                  size={16}
                  color={isActive ? colors.primary : colors.textLight}
                  style={styles.tabIcon}
                />
              )}
              <Text style={getTextStyle(isActive)}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

// List item props
interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: string;
  rightIcon?: string;
  onPress?: () => void;
  showDivider?: boolean;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon = 'chevron-right',
  onPress,
  showDivider = true,
}) => {
  return (
    <TouchableOpacity
      style={[styles.listItem, showDivider && styles.listItemDivider]}
      onPress={onPress}
      disabled={!onPress}
    >
      {leftIcon && (
        <View style={styles.leftIconContainer}>
          <FontAwesome name={leftIcon} size={20} color={colors.primary} />
        </View>
      )}
      <View style={styles.listItemContent}>
        <Text style={styles.listItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.listItemSubtitle}>{subtitle}</Text>}
      </View>
      {rightIcon && onPress && (
        <FontAwesome name={rightIcon} size={16} color={colors.textLight} />
      )}
    </TouchableOpacity>
  );
};

// Empty state props
interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: string;
  buttonText?: string;
  onButtonPress?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon = 'inbox',
  buttonText,
  onButtonPress,
}) => {
  return (
    <View style={styles.emptyStateContainer}>
      <FontAwesome name={icon} size={50} color={colors.textLight} style={styles.emptyStateIcon} />
      <Text style={styles.emptyStateTitle}>{title}</Text>
      {message && <Text style={styles.emptyStateMessage}>{message}</Text>}
      {buttonText && onButtonPress && (
        <TouchableOpacity style={styles.emptyStateButton} onPress={onButtonPress}>
          <Text style={styles.emptyStateButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    ...shadows.small,
  },
  scrollContent: {
    flexDirection: 'row',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  inactiveTab: {
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activePillTab: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.round,
    marginHorizontal: spacing.xs,
  },
  inactivePillTab: {
    backgroundColor: 'transparent',
    borderRadius: borderRadius.round,
    marginHorizontal: spacing.xs,
  },
  activeUnderlinedTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  inactiveUnderlinedTab: {
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: typography.fontWeightBold,
    fontSize: typography.fontSizeRegular,
  },
  inactiveTabText: {
    color: colors.textLight,
    fontSize: typography.fontSizeRegular,
  },
  tabIcon: {
    marginRight: spacing.xs,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.card,
  },
  listItemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  leftIconContainer: {
    marginRight: spacing.md,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: typography.fontSizeMedium,
    color: colors.text,
    fontWeight: typography.fontWeightMedium,
  },
  listItemSubtitle: {
    fontSize: typography.fontSizeRegular,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyStateIcon: {
    marginBottom: spacing.md,
  },
  emptyStateTitle: {
    fontSize: typography.fontSizeLarge,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptyStateMessage: {
    fontSize: typography.fontSizeRegular,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  emptyStateButtonText: {
    color: colors.card,
    fontWeight: typography.fontWeightMedium,
  },
});
