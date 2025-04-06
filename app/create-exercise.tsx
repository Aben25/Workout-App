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

export default function CreateExerciseScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [equipment, setEquipment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const supabase = useSupabase();
  
  const muscleGroups = [
    'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Full Body', 'Cardio'
  ];
  
  async function handleCreateExercise() {
    if (!name) {
      setError('Exercise name is required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');
      
      const { data, error } = await supabase
        .from('exercises')
        .insert([
          {
            name,
            description,
            muscle_group: muscleGroup,
            equipment,
            user_id: user.id,
            is_default: false,
          }
        ])
        .select();
        
      if (error) throw error;
      
      Alert.alert(
        'Success',
        'Exercise created successfully',
        [
          { 
            text: 'OK', 
            onPress: () => router.back() 
          }
        ]
      );
    } catch (error) {
      console.error('Error creating exercise:', error);
      setError(error.message || 'An error occurred while creating the exercise');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card style={styles.formCard}>
        <Text style={styles.title}>Create New Exercise</Text>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <Input
          label="Exercise Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter exercise name"
          required
        />
        
        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the exercise and proper form"
          multiline
          numberOfLines={4}
          style={styles.textArea}
        />
        
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Muscle Group</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={muscleGroup}
              onValueChange={(itemValue) => setMuscleGroup(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select muscle group" value="" />
              {muscleGroups.map((group) => (
                <Picker.Item key={group} label={group} value={group} />
              ))}
            </Picker>
          </View>
        </View>
        
        <Input
          label="Equipment"
          value={equipment}
          onChangeText={setEquipment}
          placeholder="Equipment needed (optional)"
        />
        
        <Button
          title={loading ? "Creating..." : "Create Exercise"}
          onPress={handleCreateExercise}
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
