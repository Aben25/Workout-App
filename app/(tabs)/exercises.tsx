import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useSupabase } from '../lib/SupabaseContext';
import { router } from 'expo-router';
import { Exercise } from '../../lib/database.types';
import { FontAwesome } from '@expo/vector-icons';

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('all');
  const supabase = useSupabase();

  const muscleGroups = [
    'all',
    'chest',
    'back',
    'shoulders',
    'arms',
    'legs',
    'core',
    'cardio'
  ];

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [searchQuery, selectedMuscleGroup, exercises]);

  async function fetchExercises() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      setExercises(data || []);
      setFilteredExercises(data || []);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  function filterExercises() {
    let filtered = [...exercises];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(exercise => 
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (exercise.description && exercise.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Filter by muscle group
    if (selectedMuscleGroup !== 'all') {
      filtered = filtered.filter(exercise => 
        exercise.muscle_group === selectedMuscleGroup
      );
    }
    
    setFilteredExercises(filtered);
  }

  function navigateToExerciseDetail(id: string) {
    router.push(`/exercise/${id}`);
  }

  function navigateToCreateExercise() {
    router.push('/create-exercise');
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
        <Text style={styles.title}>Exercise Library</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={navigateToCreateExercise}
        >
          <FontAwesome name="plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}>New Exercise</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <FontAwesome name="search" size={16} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {muscleGroups.map((group) => (
            <TouchableOpacity
              key={group}
              style={[
                styles.filterButton,
                selectedMuscleGroup === group && styles.filterButtonActive
              ]}
              onPress={() => setSelectedMuscleGroup(group)}
            >
              <Text 
                style={[
                  styles.filterButtonText,
                  selectedMuscleGroup === group && styles.filterButtonTextActive
                ]}
              >
                {group.charAt(0).toUpperCase() + group.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {filteredExercises.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No exercises found.</Text>
          <Text style={styles.emptySubText}>Try a different search or create a new exercise.</Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={navigateToCreateExercise}
          >
            <Text style={styles.createButtonText}>Create Exercise</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.exerciseCard}
              onPress={() => navigateToExerciseDetail(item.id)}
            >
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>{item.name}</Text>
                <View style={styles.muscleGroupBadge}>
                  <Text style={styles.muscleGroupText}>
                    {item.muscle_group.charAt(0).toUpperCase() + item.muscle_group.slice(1)}
                  </Text>
                </View>
              </View>
              
              {item.description && (
                <Text style={styles.exerciseDescription} numberOfLines={2}>
                  {item.description}
                </Text>
              )}
              
              <View style={styles.exerciseFooter}>
                {item.equipment && (
                  <View style={styles.exerciseStat}>
                    <FontAwesome name="wrench" size={14} color="#666" />
                    <Text style={styles.exerciseStatText}>{item.equipment}</Text>
                  </View>
                )}
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
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#3498db',
  },
  filterButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  exerciseCard: {
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
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  muscleGroupBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  muscleGroupText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2196f3',
  },
  exerciseDescription: {
    color: '#666',
    marginBottom: 12,
  },
  exerciseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseStatText: {
    marginLeft: 4,
    color: '#666',
    fontSize: 14,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
