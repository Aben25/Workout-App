import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { colors, typography, spacing, commonStyles } from '../lib/styles';
import Card from '../components/Card';
import Button from '../components/Button';
import { SectionHeader } from '../components/Navigation';

export default function ExploreScreen() {
  const workoutCategories = [
    { id: 1, name: 'Strength Training', icon: 'dumbbell' },
    { id: 2, name: 'Cardio', icon: 'heartbeat' },
    { id: 3, name: 'Flexibility', icon: 'child' },
    { id: 4, name: 'HIIT', icon: 'bolt' },
    { id: 5, name: 'Recovery', icon: 'bed' },
  ];

  const featuredWorkouts = [
    { id: 1, name: 'Full Body Strength', difficulty: 'Intermediate', duration: 45 },
    { id: 2, name: '30-Minute HIIT', difficulty: 'Advanced', duration: 30 },
    { id: 3, name: 'Morning Yoga Flow', difficulty: 'Beginner', duration: 20 },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <SectionHeader title="Explore" />
      
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Discover new workouts and exercises to enhance your fitness journey</Text>
      </View>
      
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Workout Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScrollView}>
          {workoutCategories.map(category => (
            <TouchableOpacity key={category.id} style={styles.categoryCard}>
              <View style={styles.categoryIconContainer}>
                <FontAwesome name={category.icon} size={24} color={colors.primary} />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Featured Workouts</Text>
        {featuredWorkouts.map(workout => (
          <Card key={workout.id} style={styles.workoutCard}>
            <View style={styles.workoutCardContent}>
              <View>
                <Text style={styles.workoutName}>{workout.name}</Text>
                <View style={styles.workoutDetails}>
                  <View style={styles.workoutDetail}>
                    <FontAwesome name="signal" size={14} color={colors.gray} style={styles.detailIcon} />
                    <Text style={styles.detailText}>{workout.difficulty}</Text>
                  </View>
                  <View style={styles.workoutDetail}>
                    <FontAwesome name="clock-o" size={14} color={colors.gray} style={styles.detailIcon} />
                    <Text style={styles.detailText}>{workout.duration} min</Text>
                  </View>
                </View>
              </View>
              <Button 
                title="View" 
                variant="outline" 
                size="small" 
                onPress={() => {}} 
              />
            </View>
          </Card>
        ))}
      </View>
      
      <View style={styles.tipsSection}>
        <Text style={styles.sectionTitle}>Fitness Tips</Text>
        <Card style={styles.tipCard}>
          <Text style={styles.tipTitle}>Stay Hydrated</Text>
          <Text style={styles.tipText}>
            Drinking enough water is crucial for optimal performance during workouts. 
            Aim for at least 8 glasses of water daily, and more on workout days.
          </Text>
        </Card>
        <Card style={styles.tipCard}>
          <Text style={styles.tipTitle}>Rest & Recovery</Text>
          <Text style={styles.tipText}>
            Allow your muscles time to recover between intense workouts. 
            Quality sleep and active recovery days are essential for progress.
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.md,
  },
  welcomeSection: {
    marginBottom: spacing.lg,
  },
  welcomeText: {
    fontSize: typography.fontSizes.md,
    color: colors.gray,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.dark,
    marginBottom: spacing.md,
  },
  categoriesSection: {
    marginBottom: spacing.xl,
  },
  categoriesScrollView: {
    marginLeft: -spacing.sm,
  },
  categoryCard: {
    width: 120,
    height: 100,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginLeft: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: `${colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  categoryName: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.dark,
    textAlign: 'center',
  },
  featuredSection: {
    marginBottom: spacing.xl,
  },
  workoutCard: {
    marginBottom: spacing.md,
  },
  workoutCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutName: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  workoutDetails: {
    flexDirection: 'row',
  },
  workoutDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  detailIcon: {
    marginRight: spacing.xs,
  },
  detailText: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray,
  },
  tipsSection: {
    marginBottom: spacing.xl,
  },
  tipCard: {
    marginBottom: spacing.md,
  },
  tipTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  tipText: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray,
    lineHeight: 20,
  },
});
