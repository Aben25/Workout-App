import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useSupabase } from '../lib/SupabaseContext';
import { colors, typography, spacing, commonStyles } from '../lib/styles';
import Card from '../components/Card';
import Button from '../components/Button';
import { DifficultyBadge } from '../components/Badge';
import { EmptyState } from '../components/Navigation';

export default function WorkoutsScreen() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabase();

  useEffect(() => {
    fetchWorkouts();
  }, []);

  async function fetchWorkouts() {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');
      
      const { data, error } = await supabase
        .from('workouts')
        .select(`
          *,
          workout_exercises(
            id,
            exercise:exercises(name, muscle_group)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setWorkouts(data || []);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  }

  function renderWorkoutItem({ item }) {
    const exerciseCount = item.workout_exercises?.length || 0;
    
    return (
      <Card style={styles.workoutCard}>
        <TouchableOpacity 
          style={styles.workoutCardContent}
          onPress={() => router.push(`/workout/${item.id}`)}
          activeOpacity={0.7}
        >
          <View style={styles.workoutHeader}>
            <Text style={styles.workoutName}>{item.name}</Text>
            {item.difficulty && (
              <DifficultyBadge difficulty={item.difficulty} />
            )}
          </View>
          
          {item.description && (
            <Text style={styles.workoutDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}
          
          <View style={styles.workoutDetails}>
            <View style={styles.workoutDetail}>
              <FontAwesome name="list" size={14} color={colors.gray} style={styles.detailIcon} />
              <Text style={styles.detailText}>
                {exerciseCount} {exerciseCount === 1 ? 'exercise' : 'exercises'}
              </Text>
            </View>
            
            {item.estimated_duration && (
              <View style={styles.workoutDetail}>
                <FontAwesome name="clock-o" size={14} color={colors.gray} style={styles.detailIcon} />
                <Text style={styles.detailText}>{item.estimated_duration} min</Text>
              </View>
            )}
          </View>
          
          <View style={styles.workoutActions}>
            <Button
              title="Start"
              icon="play"
              size="small"
              onPress={(e) => {
                e.stopPropagation();
                router.push(`/workout/${item.id}/start`);
              }}
              style={styles.startButton}
            />
          </View>
        </TouchableOpacity>
      </Card>
    );
  }

  return (
    <View style={commonStyles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Workouts</Text>
            <Button
              title="Create"
              icon="plus"
              size="small"
              onPress={() => router.push('/create-workout')}
            />
          </View>
          
          {workouts.length === 0 ? (
            <EmptyState
              icon="dumbbell"
              title="No Workouts Yet"
              message="Create your first workout to get started on your fitness journey."
              actionLabel="Create Workout"
              onAction={() => router.push('/create-workout')}
            />
          ) : (
            <FlatList
              data={workouts}
              renderItem={renderWorkoutItem}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.dark,
  },
  listContainer: {
    padding: spacing.md,
    paddingTop: 0,
  },
  workoutCard: {
    marginBottom: spacing.md,
  },
  workoutCardContent: {
    width: '100%',
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  workoutName: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.dark,
    flex: 1,
  },
  workoutDescription: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray,
    marginBottom: spacing.sm,
  },
  workoutDetails: {
    flexDirection: 'row',
    marginBottom: spacing.md,
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
  workoutActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  startButton: {
    minWidth: 100,
  },
});
