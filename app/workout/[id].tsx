import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useSupabase } from '../lib/SupabaseContext';
import { colors, typography, spacing, commonStyles } from '../../lib/styles';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { DifficultyBadge, MuscleGroupBadge } from '../../components/Badge';
import { WorkoutProgress } from '../../components/Progress';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams();
  const [workout, setWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const supabase = useSupabase();

  useEffect(() => {
    if (id) {
      fetchWorkoutDetails();
      fetchCompletedWorkouts();
    }
  }, [id]);

  async function fetchWorkoutDetails() {
    try {
      setLoading(true);
      
      // Fetch workout details
      const { data: workoutData, error: workoutError } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', id)
        .single();
        
      if (workoutError) throw workoutError;
      
      setWorkout(workoutData);
      
      // Fetch workout exercises
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('workout_exercises')
        .select(`
          *,
          exercise:exercises(*)
        `)
        .eq('workout_id', id)
        .order('order');
        
      if (exercisesError) throw exercisesError;
      
      setExercises(exercisesData || []);
    } catch (error) {
      console.error('Error fetching workout details:', error);
      Alert.alert('Error', 'Failed to load workout details');
    } finally {
      setLoading(false);
    }
  }

  async function fetchCompletedWorkouts() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');
      
      const { data, error } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('workout_id', id)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });
        
      if (error) throw error;
      
      setCompletedWorkouts(data || []);
    } catch (error) {
      console.error('Error fetching completed workouts:', error);
    }
  }

  function startWorkout() {
    router.push(`/workout/${id}/start`);
  }

  if (loading) {
    return (
      <View style={commonStyles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (!workout) {
    return (
      <View style={commonStyles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Workout not found</Text>
          <Button 
            title="Go Back" 
            onPress={() => router.back()} 
            style={styles.errorButton}
          />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container} edges={['bottom']}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.workoutName}>{workout.name}</Text>
          
          <View style={styles.workoutMeta}>
            {workout.difficulty && (
              <DifficultyBadge difficulty={workout.difficulty} />
            )}
            
            {workout.estimated_duration && (
              <View style={styles.durationContainer}>
                <FontAwesome name="clock-o" size={14} color={colors.gray} />
                <Text style={styles.durationText}>{workout.estimated_duration} min</Text>
              </View>
            )}
          </View>
          
          {workout.description && (
            <Text style={styles.description}>{workout.description}</Text>
          )}
        </View>
        
        <Card title="Exercises" style={styles.exercisesCard}>
          {exercises.length === 0 ? (
            <Text style={commonStyles.emptyState}>No exercises added to this workout</Text>
          ) : (
            exercises.map((item, index) => (
              <View key={item.id} style={styles.exerciseItem}>
                <View style={styles.exerciseHeader}>
                  <View style={styles.exerciseNumberContainer}>
                    <Text style={styles.exerciseNumber}>{index + 1}</Text>
                  </View>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{item.exercise?.name}</Text>
                    {item.exercise?.muscle_group && (
                      <MuscleGroupBadge muscleGroup={item.exercise.muscle_group} />
                    )}
                  </View>
                </View>
                
                <View style={styles.exerciseDetails}>
                  {item.sets > 0 && (
                    <View style={styles.exerciseDetail}>
                      <Text style={styles.detailLabel}>Sets</Text>
                      <Text style={styles.detailValue}>{item.sets}</Text>
                    </View>
                  )}
                  
                  {item.reps > 0 && (
                    <View style={styles.exerciseDetail}>
                      <Text style={styles.detailLabel}>Reps</Text>
                      <Text style={styles.detailValue}>{item.reps}</Text>
                    </View>
                  )}
                  
                  {item.duration > 0 && (
                    <View style={styles.exerciseDetail}>
                      <Text style={styles.detailLabel}>Duration</Text>
                      <Text style={styles.detailValue}>{item.duration} sec</Text>
                    </View>
                  )}
                  
                  {item.rest > 0 && (
                    <View style={styles.exerciseDetail}>
                      <Text style={styles.detailLabel}>Rest</Text>
                      <Text style={styles.detailValue}>{item.rest} sec</Text>
                    </View>
                  )}
                </View>
                
                {item.notes && (
                  <Text style={styles.exerciseNotes}>{item.notes}</Text>
                )}
              </View>
            ))
          )}
        </Card>
        
        {completedWorkouts.length > 0 && (
          <Card title="History" style={styles.historyCard}>
            {completedWorkouts.slice(0, 3).map((log) => (
              <View key={log.id} style={styles.historyItem}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyDate}>
                    {new Date(log.completed_at).toLocaleDateString()}
                  </Text>
                  {log.rating && (
                    <View style={styles.ratingContainer}>
                      {[...Array(5)].map((_, i) => (
                        <FontAwesome
                          key={i}
                          name="star"
                          size={14}
                          color={i < log.rating ? colors.warning : colors.lightGray}
                          style={styles.starIcon}
                        />
                      ))}
                    </View>
                  )}
                </View>
                
                <View style={styles.historyDetails}>
                  {log.duration && (
                    <View style={styles.historyDetail}>
                      <FontAwesome name="clock-o" size={14} color={colors.gray} style={styles.detailIcon} />
                      <Text style={styles.historyDetailText}>{log.duration} min</Text>
                    </View>
                  )}
                  
                  {log.notes && (
                    <Text style={styles.historyNotes} numberOfLines={2}>{log.notes}</Text>
                  )}
                </View>
              </View>
            ))}
            
            {completedWorkouts.length > 3 && (
              <TouchableOpacity style={styles.viewMoreContainer}>
                <Text style={styles.viewMoreText}>View all {completedWorkouts.length} sessions</Text>
              </TouchableOpacity>
            )}
          </Card>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="Start Workout"
          icon="play"
          onPress={startWorkout}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: typography.fontSizes.lg,
    color: colors.gray,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  errorButton: {
    minWidth: 120,
  },
  header: {
    padding: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  workoutName: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  workoutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.md,
  },
  durationText: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray,
    marginLeft: spacing.xs,
  },
  description: {
    fontSize: typography.fontSizes.md,
    color: colors.gray,
    lineHeight: 22,
  },
  exercisesCard: {
    margin: spacing.md,
  },
  exerciseItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  exerciseHeader: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  exerciseNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  exerciseNumber: {
    color: colors.card,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  exerciseDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.xs,
  },
  exerciseDetail: {
    marginRight: spacing.md,
    marginBottom: spacing.xs,
  },
  detailLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.gray,
  },
  detailValue: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.dark,
  },
  exerciseNotes: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray,
    fontStyle: 'italic',
  },
  historyCard: {
    margin: spacing.md,
    marginTop: 0,
  },
  historyItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  historyDate: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.dark,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  starIcon: {
    marginLeft: spacing.xs / 2,
  },
  historyDetails: {
    marginBottom: spacing.xs,
  },
  historyDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  detailIcon: {
    marginRight: spacing.xs,
  },
  historyDetailText: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray,
  },
  historyNotes: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray,
    fontStyle: 'italic',
  },
  viewMoreContainer: {
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  viewMoreText: {
    fontSize: typography.fontSizes.sm,
    color: colors.primary,
    fontWeight: typography.fontWeights.medium,
  },
  footer: {
    padding: spacing.md,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
