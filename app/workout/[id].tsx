import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSupabase } from '../../lib/SupabaseContext';
import { Workout, Exercise, WorkoutExercise } from '../../lib/database.types';
import { FontAwesome } from '@expo/vector-icons';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [workoutExercises, setWorkoutExercises] = useState<(WorkoutExercise & { exercise: Exercise })[]>([]);
  const [loading, setLoading] = useState(true);
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
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  function navigateToAddExercises() {
    router.push(`/workout/${id}/add-exercises`);
  }

  function navigateToStartWorkout() {
    router.push(`/workout/${id}/start`);
  }

  function navigateToEditWorkout() {
    router.push(`/workout/${id}/edit`);
  }

  async function handleDeleteWorkout() {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              
              const { error } = await supabase
                .from('workouts')
                .delete()
                .eq('id', id);
                
              if (error) throw error;
              
              Alert.alert('Success', 'Workout deleted successfully');
              router.replace('/workouts');
            } catch (error) {
              Alert.alert('Error', error.message);
              setLoading(false);
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (!workout) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Workout not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.workoutName}>{workout.name}</Text>
          
          <View style={styles.headerDetails}>
            {workout.difficulty && (
              <View style={[
                styles.difficultyBadge, 
                workout.difficulty === 'beginner' ? styles.beginnerBadge : 
                workout.difficulty === 'intermediate' ? styles.intermediateBadge : 
                styles.advancedBadge
              ]}>
                <Text style={styles.difficultyText}>
                  {workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1)}
                </Text>
              </View>
            )}
            
            {workout.duration && (
              <View style={styles.durationBadge}>
                <FontAwesome name="clock-o" size={14} color="#666" />
                <Text style={styles.durationText}>{workout.duration} min</Text>
              </View>
            )}
          </View>
          
          {workout.description && (
            <Text style={styles.description}>{workout.description}</Text>
          )}
        </View>
        
        <View style={styles.exercisesHeader}>
          <Text style={styles.exercisesTitle}>Exercises</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={navigateToAddExercises}
          >
            <FontAwesome name="plus" size={16} color="#fff" />
            <Text style={styles.addButtonText}>Add Exercises</Text>
          </TouchableOpacity>
        </View>
        
        {workoutExercises.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No exercises added yet</Text>
            <Text style={styles.emptySubText}>Add exercises to complete your workout</Text>
            <TouchableOpacity 
              style={styles.addExercisesButton}
              onPress={navigateToAddExercises}
            >
              <Text style={styles.addExercisesButtonText}>Add Exercises</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.exercisesList}>
            {workoutExercises.map((item, index) => (
              <View key={item.id} style={styles.exerciseItem}>
                <View style={styles.exerciseIndex}>
                  <Text style={styles.exerciseIndexText}>{index + 1}</Text>
                </View>
                <View style={styles.exerciseContent}>
                  <Text style={styles.exerciseName}>{item.exercise.name}</Text>
                  <View style={styles.exerciseDetails}>
                    <View style={styles.exerciseSets}>
                      <Text style={styles.exerciseDetailsLabel}>Sets</Text>
                      <Text style={styles.exerciseDetailsValue}>{item.sets}</Text>
                    </View>
                    {item.reps && (
                      <View style={styles.exerciseReps}>
                        <Text style={styles.exerciseDetailsLabel}>Reps</Text>
                        <Text style={styles.exerciseDetailsValue}>{item.reps}</Text>
                      </View>
                    )}
                    {item.duration && (
                      <View style={styles.exerciseDuration}>
                        <Text style={styles.exerciseDetailsLabel}>Duration</Text>
                        <Text style={styles.exerciseDetailsValue}>{item.duration}s</Text>
                      </View>
                    )}
                    {item.rest_time && (
                      <View style={styles.exerciseRest}>
                        <Text style={styles.exerciseDetailsLabel}>Rest</Text>
                        <Text style={styles.exerciseDetailsValue}>{item.rest_time}s</Text>
                      </View>
                    )}
                  </View>
                  {item.notes && (
                    <Text style={styles.exerciseNotes}>{item.notes}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.startButton}
          onPress={navigateToStartWorkout}
          disabled={workoutExercises.length === 0}
        >
          <FontAwesome name="play-circle" size={20} color="#fff" />
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={navigateToEditWorkout}
          >
            <FontAwesome name="edit" size={20} color="#3498db" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDeleteWorkout}
          >
            <FontAwesome name="trash" size={20} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>
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
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  workoutName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  headerDetails: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 10,
  },
  beginnerBadge: {
    backgroundColor: '#e8f5e9',
  },
  intermediateBadge: {
    backgroundColor: '#fff8e1',
  },
  advancedBadge: {
    backgroundColor: '#ffebee',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  durationText: {
    fontSize: 12,
    marginLeft: 5,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  exercisesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  exercisesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  addExercisesButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addExercisesButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exercisesList: {
    backgroundColor: '#fff',
  },
  exerciseItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  exerciseIndex: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  exerciseIndexText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  exerciseDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  exerciseSets: {
    marginRight: 20,
  },
  exerciseReps: {
    marginRight: 20,
  },
  exerciseDuration: {
    marginRight: 20,
  },
  exerciseRest: {},
  exerciseDetailsLabel: {
    fontSize: 12,
    color: '#999',
  },
  exerciseDetailsValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  exerciseNotes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  startButton: {
    flex: 1,
    backgroundColor: '#27ae60',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  editButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3498db',
    borderRadius: 8,
    marginRight: 10,
  },
  deleteButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e74c3c',
    borderRadius: 8,
  },
});
