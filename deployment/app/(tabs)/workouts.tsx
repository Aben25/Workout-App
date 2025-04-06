import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useSupabase } from '../../lib/SupabaseContext';
import { router } from 'expo-router';
import { Workout } from '../../lib/database.types';
import { FontAwesome } from '@expo/vector-icons';

export default function WorkoutsScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
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
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setWorkouts(data || []);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  function navigateToWorkoutDetail(id: string) {
    router.push(`/workout/${id}`);
  }

  function navigateToCreateWorkout() {
    router.push('/create-workout');
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Workouts</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={navigateToCreateWorkout}
        >
          <FontAwesome name="plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}>New Workout</Text>
        </TouchableOpacity>
      </View>
      
      {workouts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You don't have any workouts yet.</Text>
          <Text style={styles.emptySubText}>Create your first workout to get started!</Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={navigateToCreateWorkout}
          >
            <Text style={styles.createButtonText}>Create Workout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.workoutCard}
              onPress={() => navigateToWorkoutDetail(item.id)}
            >
              <View style={styles.workoutHeader}>
                <Text style={styles.workoutName}>{item.name}</Text>
                {item.difficulty && (
                  <View style={[
                    styles.difficultyBadge, 
                    item.difficulty === 'beginner' ? styles.beginnerBadge : 
                    item.difficulty === 'intermediate' ? styles.intermediateBadge : 
                    styles.advancedBadge
                  ]}>
                    <Text style={styles.difficultyText}>
                      {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
                    </Text>
                  </View>
                )}
              </View>
              
              {item.description && (
                <Text style={styles.workoutDescription} numberOfLines={2}>
                  {item.description}
                </Text>
              )}
              
              <View style={styles.workoutFooter}>
                {item.duration && (
                  <View style={styles.workoutStat}>
                    <FontAwesome name="clock-o" size={14} color="#666" />
                    <Text style={styles.workoutStatText}>{item.duration} min</Text>
                  </View>
                )}
                <Text style={styles.workoutDate}>
                  {new Date(item.created_at).toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
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
  listContainer: {
    padding: 16,
  },
  workoutCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
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
  workoutDescription: {
    color: '#666',
    marginBottom: 12,
  },
  workoutFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutStatText: {
    marginLeft: 4,
    color: '#666',
    fontSize: 14,
  },
  workoutDate: {
    color: '#999',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  createButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
