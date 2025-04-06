import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useSupabase } from '../../../lib/SupabaseContext';
import { colors, typography, spacing, commonStyles } from '../../lib/styles';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { DifficultyBadge } from '../../components/Badge';
import { WorkoutProgress } from '../../components/Progress';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WorkoutSessionScreen() {
  const { id } = useLocalSearchParams();
  const [workout, setWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedExercises, setCompletedExercises] = useState({});
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [rating, setRating] = useState(0);
  const [savingWorkout, setSavingWorkout] = useState(false);
  
  const supabase = useSupabase();

  useEffect(() => {
    if (id) {
      fetchWorkoutDetails();
    }
  }, [id]);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    } else if (!isActive && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

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
      
      // Initialize completed exercises tracking
      const initialCompletedState = {};
      exercisesData.forEach(exercise => {
        initialCompletedState[exercise.id] = Array(exercise.sets || 1).fill(false);
      });
      setCompletedExercises(initialCompletedState);
      
    } catch (error) {
      console.error('Error fetching workout details:', error);
      Alert.alert('Error', 'Failed to load workout details');
      router.back();
    } finally {
      setLoading(false);
    }
  }

  function startSession() {
    setSessionStarted(true);
    setIsActive(true);
  }

  function pauseSession() {
    setIsActive(false);
  }

  function resumeSession() {
    setIsActive(true);
  }

  function toggleSetCompletion(exerciseId, setIndex) {
    setCompletedExercises(prev => {
      const updatedSets = [...prev[exerciseId]];
      updatedSets[setIndex] = !updatedSets[setIndex];
      return {
        ...prev,
        [exerciseId]: updatedSets
      };
    });
  }

  function getTotalSets() {
    return Object.values(completedExercises).reduce((total, sets) => total + sets.length, 0);
  }

  function getCompletedSets() {
    return Object.values(completedExercises).reduce((total, sets) => 
      total + sets.filter(completed => completed).length, 0);
  }

  function isWorkoutComplete() {
    return getCompletedSets() === getTotalSets();
  }

  function completeWorkout() {
    setSessionCompleted(true);
    setIsActive(false);
  }

  async function saveWorkoutLog() {
    try {
      setSavingWorkout(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');
      
      // Calculate duration in minutes
      const durationMinutes = Math.round(timer / 60);
      
      // Save workout log
      const { data, error } = await supabase
        .from('workout_logs')
        .insert([
          {
            user_id: user.id,
            workout_id: id,
            duration: durationMinutes,
            completed_at: new Date().toISOString(),
            rating: rating,
          }
        ])
        .select();
        
      if (error) throw error;
      
      // Navigate back to workout details
      router.replace(`/workout/${id}`);
      
    } catch (error) {
      console.error('Error saving workout log:', error);
      Alert.alert('Error', 'Failed to save workout log');
    } finally {
      setSavingWorkout(false);
    }
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

  if (sessionCompleted) {
    return (
      <SafeAreaView style={commonStyles.container} edges={['top', 'bottom']}>
        <View style={styles.completionContainer}>
          <View style={styles.completionHeader}>
            <FontAwesome name="check-circle" size={80} color={colors.secondary} />
            <Text style={styles.completionTitle}>Workout Complete!</Text>
            <Text style={styles.completionSubtitle}>Great job on completing your workout</Text>
          </View>
          
          <Card style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Duration</Text>
              <Text style={styles.summaryValue}>{formatTime(timer)}</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Exercises</Text>
              <Text style={styles.summaryValue}>{exercises.length}</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Sets Completed</Text>
              <Text style={styles.summaryValue}>{getCompletedSets()}</Text>
            </View>
          </Card>
          
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>How was your workout?</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity 
                  key={star} 
                  onPress={() => setRating(star)}
                  style={styles.starButton}
                >
                  <FontAwesome 
                    name={rating >= star ? "star" : "star-o"} 
                    size={36} 
                    color={rating >= star ? colors.warning : colors.gray} 
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.completionActions}>
            <Button
              title={savingWorkout ? "Saving..." : "Save Workout"}
              onPress={saveWorkoutLog}
              disabled={savingWorkout}
              fullWidth
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            if (sessionStarted) {
              Alert.alert(
                'Exit Workout',
                'Are you sure you want to exit? Your progress will be lost.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Exit', onPress: () => router.back() }
                ]
              );
            } else {
              router.back();
            }
          }}
        >
          <FontAwesome name="arrow-left" size={24} color={colors.dark} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>{workout.name}</Text>
        
        <View style={styles.headerRight}>
          {workout.difficulty && (
            <DifficultyBadge difficulty={workout.difficulty} />
          )}
        </View>
      </View>
      
      <View style={styles.timerContainer}>
        <Text style={styles.timer}>{formatTime(timer)}</Text>
        
        {!sessionStarted ? (
          <Button
            title="Start Workout"
            icon="play"
            onPress={startSession}
            style={styles.timerButton}
          />
        ) : (
          <View style={styles.timerControls}>
            {isActive ? (
              <Button
                title="Pause"
                icon="pause"
                variant="outline"
                onPress={pauseSession}
                style={styles.timerControlButton}
              />
            ) : (
              <Button
                title="Resume"
                icon="play"
                variant="outline"
                onPress={resumeSession}
                style={styles.timerControlButton}
              />
            )}
            
            <Button
              title="Complete"
              icon="check"
              onPress={completeWorkout}
              style={styles.timerControlButton}
              disabled={!isWorkoutComplete()}
            />
          </View>
        )}
      </View>
      
      {sessionStarted && (
        <WorkoutProgress 
          completed={getCompletedSets()} 
          total={getTotalSets()} 
          style={styles.progressBar}
        />
      )}
      
      <ScrollView style={styles.exercisesContainer}>
        {exercises.map((exercise) => (
          <Card key={exercise.id} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{exercise.exercise?.name}</Text>
            
            <View style={styles.exerciseDetails}>
              {exercise.sets > 0 && (
                <View style={styles.exerciseDetail}>
                  <Text style={styles.detailLabel}>Sets</Text>
                  <Text style={styles.detailValue}>{exercise.sets}</Text>
                </View>
              )}
              
              {exercise.reps > 0 && (
                <View style={styles.exerciseDetail}>
                  <Text style={styles.detailLabel}>Reps</Text>
                  <Text style={styles.detailValue}>{exercise.reps}</Text>
                </View>
              )}
              
              {exercise.duration > 0 && (
                <View style={styles.exerciseDetail}>
                  <Text style={styles.detailLabel}>Duration</Text>
                  <Text style={styles.detailValue}>{exercise.duration} sec</Text>
                </View>
              )}
              
              {exercise.rest > 0 && (
                <View style={styles.exerciseDetail}>
                  <Text style={styles.detailLabel}>Rest</Text>
                  <Text style={styles.detailValue}>{exercise.rest} sec</Text>
                </View>
              )}
            </View>
            
            {sessionStarted && (
              <View style={styles.setsContainer}>
                <Text style={styles.setsLabel}>Sets:</Text>
                <View style={styles.setButtons}>
                  {completedExercises[exercise.id]?.map((completed, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.setButton,
                        completed ? styles.setButtonCompleted : styles.setButtonIncomplete
                      ]}
                      onPress={() => toggleSetCompletion(exercise.id, index)}
                    >
                      <Text style={[
                        styles.setButtonText,
                        completed ? styles.setButtonTextCompleted : styles.setButtonTextIncomplete
                      ]}>
                        {index + 1}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.dark,
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  timerContainer: {
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  timer: {
    fontSize: typography.fontSizes.xxxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  timerButton: {
    minWidth: 200,
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  timerControlButton: {
    minWidth: 120,
    marginHorizontal: spacing.xs,
  },
  progressBar: {
    padding: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  exercisesContainer: {
    flex: 1,
    padding: spacing.md,
  },
  exerciseCard: {
    marginBottom: spacing.md,
  },
  exerciseName: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  exerciseDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
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
  setsContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  setsLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  setButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  setButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  setButtonIncomplete: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  setButtonCompleted: {
    backgroundColor: colors.secondary,
  },
  setButtonText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
  },
  setButtonTextIncomplete: {
    color: colors.gray,
  },
  setButtonTextCompleted: {
    color: colors.card,
  },
  // Completion screen styles
  completionContainer: {
    flex: 1,
    padding: spacing.md,
  },
  completionHeader: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  completionTitle: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.dark,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  completionSubtitle: {
    fontSize: typography.fontSizes.md,
    color: colors.gray,
    textAlign: 'center',
  },
  summaryCard: {
    marginBottom: spacing.xl,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryLabel: {
    fontSize: typography.fontSizes.md,
    color: colors.dark,
  },
  summaryValue: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  ratingLabel: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.medium,
    color: colors.dark,
    marginBottom: spacing.md,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  starButton: {
    padding: spacing.xs,
  },
  completionActions: {
    marginTop: 'auto',
  },
});
