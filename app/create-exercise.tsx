import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useSupabase } from '../lib/SupabaseContext';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

export default function CreateExerciseScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('chest');
  const [equipment, setEquipment] = useState('');
  const [difficulty, setDifficulty] = useState('beginner');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  
  const supabase = useSupabase();

  const muscleGroups = [
    'chest',
    'back',
    'shoulders',
    'arms',
    'legs',
    'core',
    'cardio'
  ];

  async function handleCreateExercise() {
    if (!name) {
      Alert.alert('Error', 'Please enter an exercise name');
      return;
    }
    
    if (!muscleGroup) {
      Alert.alert('Error', 'Please select a muscle group');
      return;
    }
    
    try {
      setLoading(true);
      
      const newExercise = {
        name,
        description: description || null,
        muscle_group: muscleGroup,
        equipment: equipment || null,
        difficulty,
        instructions: instructions || null,
      };
      
      const { data, error } = await supabase
        .from('exercises')
        .insert(newExercise)
        .select()
        .single();
        
      if (error) throw error;
      
      Alert.alert('Success', 'Exercise created successfully');
      router.push(`/exercise/${data.id}`);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create New Exercise</Text>
      
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Exercise Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Bench Press"
            value={name}
            onChangeText={setName}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the exercise..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Muscle Group *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={muscleGroup}
              onValueChange={(itemValue) => setMuscleGroup(itemValue)}
              style={styles.picker}
            >
              {muscleGroups.map((group) => (
                <Picker.Item 
                  key={group} 
                  label={group.charAt(0).toUpperCase() + group.slice(1)} 
                  value={group} 
                />
              ))}
            </Picker>
          </View>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Equipment</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Barbell, Dumbbells"
            value={equipment}
            onChangeText={setEquipment}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Difficulty</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={difficulty}
              onValueChange={(itemValue) => setDifficulty(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Beginner" value="beginner" />
              <Picker.Item label="Intermediate" value="intermediate" />
              <Picker.Item label="Advanced" value="advanced" />
            </Picker>
          </View>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Instructions</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Step-by-step instructions..."
            value={instructions}
            onChangeText={setInstructions}
            multiline
            numberOfLines={6}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleCreateExercise}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Exercise</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
