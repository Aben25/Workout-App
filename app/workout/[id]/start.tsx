import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSupabase } from '../lib/SupabaseContext';
import { Workout, Exercise, WorkoutExercise } from '../../lib/database.types';
import { FontAwesome } from '@expo/vector-icons';

export default function StartWorkoutScreen() {
  const { id } = useLocalSearchParams();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [workoutExercises, setWorkoutExercises] = useState<(WorkoutExercise & { exercise: Exercise })[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<{[key: string]: boolean[]}>({});
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);
  const [workoutLogId, setWorkoutLogId] = useState<string | null>(null);
  
  const supabase = useSupabase();

  useEffect(() => {
    if (id) {
      fetchWorkoutDetails();
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
      
      // Fetch workout exercises with exercise details
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('workout_exercises')
        .select(`
          *,
          exercise:exercises(*)
        `)
        .eq('workout_id', id)
        .order('order_index');
        
      if (exercisesError) throw exercisesError;
      
      setWorkoutExercises(exercisesData);
      
      // Initialize completed sets tracking
      const initialCompletedSets = {};
      exercisesData.forEach(item => {
        initialCompletedSets[item.id] = Array(item.sets).fill(false);
      });
      setCompletedSets(initialCompletedSets);
      
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function startWorkout() {
    try {
      const startTime = new Date();
      setWorkoutStartTime(startTime);
      setWorkoutStarted(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');
      
      // Create workout log entry
      const { data, error } = await supabase
        .from('workout_logs')
        .insert({
          user_id: user.id,
          workout_id: id,
          started_at: startTime.toISOString(),
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setWorkoutLogId(data.id);
      
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  async function completeWorkout() {
    try {
      if (!workoutLogId || !workoutStartTime) return;
      
      const endTime = new Date();
      const durationInMinutes = Math.round((endTime.getTime() - workoutStartTime.getTime()) / 60000);
      
      // Update workout log with completion time and duration
      const { error } = await supabase
        .from('workout_logs')
        .update({
          completed_at: endTime.toISOString(),
          duration: durationInMinutes,
        })
        .eq('id', workoutLogId);
        
      if (error) throw error;
      
      // Log exercise completions
      for (const exercise of workoutExercises) {
        const completedSetCount = completedSets[exercise.id].filter(Boolean).length;
        
        if (completedSetCount > 0) {
          await supabase
            .from('exercise_logs')
            .insert({
              workout_log_id: workoutLogId,
              exercise_id: exercise.exercise.id,
              sets_completed: completedSetCount,
              reps_completed: exercise.reps,
            });
        }
      }
      
      Alert.alert(
        'Workout Completed!',
        `Great job! You completed this workout in ${durationInMinutes} minutes.`,
        [
          {
            text: 'OK',
            onPress: () => router.replace('/workouts'),
          },
        ]
      );
      
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  function toggleSetCompletion(exerciseId: string, setIndex: number) {
    setCompletedSets(prev => {
      const updatedSets = {...prev};
      updatedSets[exerciseId] = [...updatedSets[exerciseId]];
      updatedSets[exerciseId][setIndex] = !updatedSets[exerciseId][setIndex];
      return updatedSets;
    });
  }

  function goToNextExercise() {
    if (activeExerciseIndex < workoutExercises.length - 1) {
      setActiveExerciseIndex(prev => prev + 1);
    }
  }

  function goToPreviousExercise() {
    if (activeExerciseIndex > 0) {
      setActiveExerciseIndex(prev => prev - 1);
    }
  }

  function isExerciseComplete(exerciseId: string) {
    return completedSets[exerciseId] && completedSets[exerciseId].every(Boolean);
  }

  function getCompletedSetsCount(exerciseId: string) {
    return completedSets[exerciseId] ? completedSets[exerciseId].filter(Boolean).length : 0;
  }

  function getTotalCompletedSetsCount() {
    let total = 0;
    Object.keys(completedSets).forEach(exerciseId => {
      total += getCompletedSetsCount(exerciseId);
    });
    return total;
  }

  function getTotalSetsCount() {
    let total = 0;
    workoutExercises.forEach(exercise => {
      total += exercise.sets;
    });
    return total;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (!workout || workoutExercises.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Workout not found or has no exercises</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const activeExercise = workoutExercises[activeExerciseIndex];
  const progress = getTotalCompletedSetsCount() / getTotalSetsCount();

  return (
    <View style={styles.container}>
      {!workoutStarted ? (
        <View style={styles.startContainer}>
          <Text style={styles.workoutName}>{workout.name}</Text>
          
          <View style={styles.workoutInfo}>
            <Text style={styles.infoText}>
              <FontAwesome name="dumbbell" size={16} color="#666" /> {workoutExercises.length} Exercises
            </Text>
            {workout.duration && (
              <Text style={styles.infoText}>
                <FontAwesome name="clock-o" size={16} color="#666" /> {workout.duration} min
              </Text>
            )}
          </View>
          
          <View style={styles.exercisePreview}>
            <Text style={styles.previewTitle}>Exercises:</Text>
            {workoutExercises.map((item, index) => (
              <View key={item.id} style={styles.previewItem}>
                <Text style={styles.previewNumber}>{index + 1}.</Text>
                <Text style={styles.previewName}>{item.exercise.name}</Text>
                <Text style={styles.previewSets}>{item.sets} sets</Text>
              </View>
            ))}
          </View>
          
          <TouchableOpacity 
            style={styles.startButton}
            onPress={startWorkout}
          >
            <FontAwesome name="play-circle" size={24} color="#fff" />
            <Text style={styles.startButtonText}>Start Workout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progress * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {getTotalCompletedSetsCount()}/{getTotalSetsCount()} sets completed
            </Text>
          </View>
          
          <View style={styles.exerciseContainer}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseCount}>
                Exercise {activeExerciseIndex + 1}/{workoutExercises.length}
              </Text>
              <Text style={styles.exerciseName}>{activeExercise.exercise.name}</Text>
              
              <View style={styles.exerciseDetails}>
                {activeExercise.reps && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Reps</Text>
                    <Text style={styles.detailValue}>{activeExercise.reps}</Text>
                  </View>
                )}
                
                {activeExercise.duration && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Duration</Text>
                    <Text style={styles.detailValue}>{activeExercise.duration}s</Text>
                  </View>
                )}
                
                {activeExercise.rest_time && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Rest</Text>
                    <Text style={styles.detailValue}>{activeExercise.rest_time}s</Text>
                  </View>
                )}
              </View>
            </View>
            
            <ScrollView style={styles.setsContainer}>
              <Text style={styles.setsTitle}>Sets</Text>
              
              {Array.from({ length: activeExercise.sets }).map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.setItem,
                    completedSets[activeExercise.id][index] && styles.setItemCompleted
                  ]}
                  onPress={() => toggleSetCompletion(activeExercise.id, index)}
                >
                  <Text style={styles.setNumber}>Set {index + 1}</Text>
                  
                  {completedSets[activeExercise.id][index] ? (
                    <FontAwesome name="check-circle" size={24} color="#27ae60" />
                  ) : (
                    <View style={styles.setCircle} />
                  )}
                </TouchableOpacity>
              ))}
              
              {activeExercise.notes && (
                <View style={styles.notesContainer}>
                  <Text style={styles.notesTitle}>Notes:</Text>
                  <Text style={styles.notesText}>{activeExercise.notes}</Text>
                </View>
              )}
            </ScrollView>
            
            <View style={styles.navigationButtons}>
              <TouchableOpacity
                style={[styles.navButton, activeExerciseIndex === 0 && styles.navButtonDisabled]}
                onPress={goToPreviousExercise}
                disabled={activeExerciseIndex === 0}
              >
                <FontAwesome 
                  name="chevron-left" 
                  size={20} 
                  color={activeExerciseIndex === 0 ? '#ccc' : '#3498db'} 
                />
                <Text 
                  style={[
                    styles.navButtonText,
                    activeExerciseIndex === 0 && styles.navButtonTextDisabled
                  ]}
                >
                  Previous
                </Text>
              </TouchableOpacity>
              
              {activeExerciseIndex < workoutExercises.length - 1 ? (
                <TouchableOpacity
                  style={styles.navButton}
                  onPress={goToNextExercise}
                >
                  <Text style={styles.navButtonText}>Next</Text>
                  <FontAwesome name="chevron-right" size={20} color="#3498db" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={completeWorkout}
                >
                  <Text style={styles.completeButtonText}>Complete Workout</Text>
                  <FontAwesome name="check" size={20} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  startContainer: {
    flex: 1,
    padding: 20,
  },
  workoutName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  workoutInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 10,
  },
  exercisePreview: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  previewNumber: {
    width: 30,
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewName: {
    flex: 1,
    fontSize: 16,
  },
  previewSets: {
    fontSize: 14,
    color: '#666',
  },
  startButton: {
    backgroundColor: '#27ae60',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 8,
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
  progressContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#27ae60',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  exerciseContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  exerciseHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  exerciseCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  exerciseDetails: {
    flexDirection: 'row',
  },
  detailItem: {
    marginRight: 20,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  setsContainer: {
    flex: 1,
    padding: 20,
  },
  setsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  setItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  setItemCompleted: {
    backgroundColor: '#f1f9f5',
    borderColor: '#c8e6c9',
  },
  setNumber: {
    fontSize: 16,
    fontWeight: '500',
  },
  setCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  notesContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
    marginHorizontal: 5,
  },
  navButtonTextDisabled: {
    color: '#ccc',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 5,
  },
});
