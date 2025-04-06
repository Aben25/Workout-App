import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useSupabase } from '../lib/SupabaseContext';
import { colors, typography, spacing, commonStyles } from '../lib/styles';
import Card from '../components/Card';
import Button from '../components/Button';
import { MuscleGroupBadge } from '../components/Badge';
import { EmptyState } from '../components/Navigation';

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('All');
  const supabase = useSupabase();

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    if (selectedMuscleGroup === 'All') {
      setFilteredExercises(exercises);
    } else {
      setFilteredExercises(exercises.filter(ex => ex.muscle_group === selectedMuscleGroup));
    }
  }, [selectedMuscleGroup, exercises]);

  async function fetchExercises() {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');
      
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .or(`user_id.eq.${user.id},is_default.eq.true`)
        .order('name');
        
      if (error) throw error;
      
      setExercises(data || []);
      setFilteredExercises(data || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  }

  function getMuscleGroups() {
    const groups = [...new Set(exercises.map(ex => ex.muscle_group))].filter(Boolean);
    return ['All', ...groups.sort()];
  }

  function renderExerciseItem({ item }) {
    return (
      <Card style={styles.exerciseCard}>
        <TouchableOpacity 
          style={styles.exerciseCardContent}
          onPress={() => {}}
          activeOpacity={0.7}
        >
          <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseName}>{item.name}</Text>
            {item.muscle_group && (
              <MuscleGroupBadge muscleGroup={item.muscle_group} />
            )}
          </View>
          
          {item.description && (
            <Text style={styles.exerciseDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}
          
          <View style={styles.exerciseDetails}>
            {item.equipment && (
              <View style={styles.exerciseDetail}>
                <FontAwesome name="wrench" size={14} color={colors.gray} style={styles.detailIcon} />
                <Text style={styles.detailText}>{item.equipment}</Text>
              </View>
            )}
            
            {item.is_default && (
              <View style={styles.exerciseDetail}>
                <FontAwesome name="check-circle" size={14} color={colors.secondary} style={styles.detailIcon} />
                <Text style={styles.detailText}>Default</Text>
              </View>
            )}
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
            <Text style={styles.headerTitle}>Exercises</Text>
            <Button
              title="Create"
              icon="plus"
              size="small"
              onPress={() => router.push('/create-exercise')}
            />
          </View>
          
          <View style={styles.filterContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScrollContent}
            >
              {getMuscleGroups().map(group => (
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
                    {group}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          {filteredExercises.length === 0 ? (
            <EmptyState
              icon="dumbbell"
              title="No Exercises Found"
              message={selectedMuscleGroup === 'All' 
                ? "Create your first exercise to get started." 
                : `No exercises found for ${selectedMuscleGroup} muscle group.`}
              actionLabel="Create Exercise"
              onAction={() => router.push('/create-exercise')}
            />
          ) : (
            <FlatList
              data={filteredExercises}
              renderItem={renderExerciseItem}
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
  filterContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  filterScrollContent: {
    paddingRight: spacing.md,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.background,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray,
  },
  filterButtonTextActive: {
    color: colors.card,
    fontWeight: typography.fontWeights.medium,
  },
  listContainer: {
    padding: spacing.md,
    paddingTop: 0,
  },
  exerciseCard: {
    marginBottom: spacing.md,
  },
  exerciseCardContent: {
    width: '100%',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  exerciseName: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.dark,
    flex: 1,
  },
  exerciseDescription: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray,
    marginBottom: spacing.sm,
  },
  exerciseDetails: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  exerciseDetail: {
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
});
