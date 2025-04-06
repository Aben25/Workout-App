import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useSupabase } from '../lib/SupabaseContext';
import { colors, typography, spacing, commonStyles } from '../lib/styles';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { Picker } from '@react-native-picker/picker';

export default function CreateWorkoutScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const supabase = useSupabase();
  
  const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'];
  
  async function handleCreateWorkout() {
    if (!name) {
      setError('Workout name is required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');
      
      const { data, error } = await supabase
        .from('workouts')
        .insert([
          {
            name,
            description,
            difficulty,
            estimated_duration: estimatedDuration ? parseInt(estimatedDuration) : null,
            user_id: user.id,
          }
        ])
        .select();
        
      if (error) throw error;
      
      Alert.alert(
        'Success',
        'Workout created successfully',
        [
          { 
            text: 'Add Exercises', 
            onPress: () => router.push(`/workout/${data[0].id}`) 
          },
          {
            text: 'Go to Workouts',
            onPress: () => router.push('/workouts'),
            style: 'cancel'
          }
        ]
      );
    } catch (error) {
      console.error('Error creating workout:', error);
      setError(error.message || 'An error occurred while creating the workout');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card style={styles.formCard}>
        <Text style={styles.title}>Create New Workout</Text>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <Input
          label="Workout Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter workout name"
          required
        />
        
        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the workout"
          multiline
          numberOfLines={4}
          style={styles.textArea}
        />
        
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Difficulty Level</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={difficulty}
              onValueChange={(itemValue) => setDifficulty(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select difficulty" value="" />
              {difficultyLevels.map((level) => (
                <Picker.Item key={level} label={level} value={level.toLowerCase()} />
              ))}
            </Picker>
          </View>
        </View>
        
        <Input
          label="Estimated Duration (minutes)"
          value={estimatedDuration}
          onChangeText={(text) => setEstimatedDuration(text.replace(/[^0-9]/g, ''))}
          placeholder="Enter estimated duration"
          keyboardType="numeric"
        />
        
        <Button
          title={loading ? "Creating..." : "Create Workout"}
          onPress={handleCreateWorkout}
          disabled={loading}
          fullWidth
          style={styles.submitButton}
        />
      </Card>
      
      <TouchableOpacity 
        style={styles.cancelButton}
        onPress={() => router.back()}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
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
  formCard: {
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.dark,
    marginBottom: spacing.lg,
  },
  errorText: {
    color: colors.danger,
    marginBottom: spacing.md,
    fontSize: typography.fontSizes.sm,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    marginBottom: spacing.md,
  },
  pickerLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.card,
    marginBottom: spacing.sm,
  },
  picker: {
    height: 50,
  },
  submitButton: {
    marginTop: spacing.md,
  },
  cancelButton: {
    alignItems: 'center',
    padding: spacing.md,
    marginTop: spacing.md,
  },
  cancelButtonText: {
    color: colors.primary,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
  },
});
