import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../lib/styles';

type ProgressProps = {
  progress: number; // 0 to 1
  height?: number;
  width?: number | string;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  style?: any;
};

export default function Progress({
  progress,
  height = 8,
  width = '100%',
  color = colors.primary,
  backgroundColor = colors.border,
  showPercentage = false,
  style,
}: ProgressProps) {
  // Ensure progress is between 0 and 1
  const normalizedProgress = Math.min(Math.max(progress, 0), 1);
  
  // Calculate percentage
  const percentage = Math.round(normalizedProgress * 100);

  return (
    <View style={[styles.container, style]}>
      <View 
        style={[
          styles.progressBar, 
          { 
            height, 
            width, 
            backgroundColor 
          }
        ]}
      >
        <View 
          style={[
            styles.progress, 
            { 
              width: `${percentage}%`, 
              height: '100%', 
              backgroundColor: color 
            }
          ]}
        />
      </View>
      {showPercentage && (
        <Text style={styles.percentageText}>{percentage}%</Text>
      )}
    </View>
  );
}

// Workout completion progress component
export function WorkoutProgress({ 
  completed, 
  total, 
  style 
}: { 
  completed: number; 
  total: number; 
  style?: any; 
}) {
  const progress = total > 0 ? completed / total : 0;
  
  return (
    <View style={[styles.workoutProgressContainer, style]}>
      <View style={styles.workoutProgressHeader}>
        <Text style={styles.workoutProgressTitle}>Progress</Text>
        <Text style={styles.workoutProgressCount}>{completed}/{total}</Text>
      </View>
      <Progress progress={progress} height={10} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  progressBar: {
    borderRadius: borderRadius.round,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: borderRadius.round,
  },
  percentageText: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
  workoutProgressContainer: {
    marginVertical: spacing.md,
  },
  workoutProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  workoutProgressTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.dark,
  },
  workoutProgressCount: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray,
  },
});
