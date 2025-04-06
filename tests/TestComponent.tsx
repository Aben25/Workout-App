import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../lib/styles';

// Test component to verify rendering of UI elements
export const TestComponent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>UI Component Test</Text>
      <Text style={styles.description}>
        This component is used to verify that the UI components are rendering correctly.
      </Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Typography Test</Text>
        <Text style={styles.heading1}>Heading 1</Text>
        <Text style={styles.heading2}>Heading 2</Text>
        <Text style={styles.heading3}>Heading 3</Text>
        <Text style={styles.bodyText}>Body Text</Text>
        <Text style={styles.smallText}>Small Text</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Color Test</Text>
        <View style={styles.colorRow}>
          <View style={[styles.colorBox, { backgroundColor: colors.primary }]}>
            <Text style={styles.colorText}>Primary</Text>
          </View>
          <View style={[styles.colorBox, { backgroundColor: colors.secondary }]}>
            <Text style={styles.colorText}>Secondary</Text>
          </View>
          <View style={[styles.colorBox, { backgroundColor: colors.accent }]}>
            <Text style={styles.colorText}>Accent</Text>
          </View>
        </View>
        <View style={styles.colorRow}>
          <View style={[styles.colorBox, { backgroundColor: colors.success }]}>
            <Text style={styles.colorText}>Success</Text>
          </View>
          <View style={[styles.colorBox, { backgroundColor: colors.warning }]}>
            <Text style={styles.colorText}>Warning</Text>
          </View>
          <View style={[styles.colorBox, { backgroundColor: colors.danger }]}>
            <Text style={styles.colorText}>Danger</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spacing Test</Text>
        <View style={styles.spacingRow}>
          <View style={[styles.spacingBox, { width: spacing.xs, height: spacing.xs }]} />
          <View style={[styles.spacingBox, { width: spacing.sm, height: spacing.sm }]} />
          <View style={[styles.spacingBox, { width: spacing.md, height: spacing.md }]} />
          <View style={[styles.spacingBox, { width: spacing.lg, height: spacing.lg }]} />
          <View style={[styles.spacingBox, { width: spacing.xl, height: spacing.xl }]} />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Border Radius Test</Text>
        <View style={styles.borderRow}>
          <View style={[styles.borderBox, { borderRadius: borderRadius.sm }]} />
          <View style={[styles.borderBox, { borderRadius: borderRadius.md }]} />
          <View style={[styles.borderBox, { borderRadius: borderRadius.lg }]} />
          <View style={[styles.borderBox, { borderRadius: borderRadius.xl }]} />
          <View style={[styles.borderBox, { borderRadius: borderRadius.round }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: typography.fontSizeXXLarge,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.fontSizeRegular,
    color: colors.textLight,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
  },
  sectionTitle: {
    fontSize: typography.fontSizeLarge,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  heading1: {
    fontSize: typography.fontSizeXXLarge,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  heading2: {
    fontSize: typography.fontSizeXLarge,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  heading3: {
    fontSize: typography.fontSizeLarge,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  bodyText: {
    fontSize: typography.fontSizeRegular,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  smallText: {
    fontSize: typography.fontSizeSmall,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  colorBox: {
    width: '30%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  colorText: {
    color: '#ffffff',
    fontWeight: typography.fontWeightBold,
    fontSize: typography.fontSizeSmall,
  },
  spacingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  spacingBox: {
    backgroundColor: colors.primary,
  },
  borderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  borderBox: {
    width: 50,
    height: 50,
    backgroundColor: colors.primary,
  },
});

export default TestComponent;
