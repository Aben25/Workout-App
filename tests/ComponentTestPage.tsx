import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../lib/styles';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Badge, DifficultyBadge, MuscleGroupBadge } from '../components/Badge';
import { ProgressBar, LoadingSpinner } from '../components/Progress';
import { TabBar, ListItem, EmptyState } from '../components/Navigation';

// Test page to verify all components
export const ComponentTestPage = () => {
  const [activeTab, setActiveTab] = useState('buttons');
  const [inputValue, setInputValue] = useState('');

  const tabs = [
    { key: 'buttons', label: 'Buttons', icon: 'square' },
    { key: 'inputs', label: 'Inputs', icon: 'pencil' },
    { key: 'cards', label: 'Cards', icon: 'credit-card' },
    { key: 'badges', label: 'Badges', icon: 'tag' },
    { key: 'progress', label: 'Progress', icon: 'spinner' },
    { key: 'navigation', label: 'Navigation', icon: 'bars' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Component Test Page</Text>
      
      <TabBar 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        variant="pills"
      />
      
      <ScrollView style={styles.content}>
        {activeTab === 'buttons' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Button Components</Text>
            
            <View style={styles.componentRow}>
              <Button title="Primary Button" onPress={() => {}} />
            </View>
            
            <View style={styles.componentRow}>
              <Button title="Secondary Button" variant="secondary" onPress={() => {}} />
            </View>
            
            <View style={styles.componentRow}>
              <Button title="Outline Button" variant="outline" onPress={() => {}} />
            </View>
            
            <View style={styles.componentRow}>
              <Button title="Danger Button" variant="danger" onPress={() => {}} />
            </View>
            
            <View style={styles.componentRow}>
              <Button title="Small Button" size="small" onPress={() => {}} />
            </View>
            
            <View style={styles.componentRow}>
              <Button title="Large Button" size="large" onPress={() => {}} />
            </View>
            
            <View style={styles.componentRow}>
              <Button title="With Icon" icon="plus" onPress={() => {}} />
            </View>
            
            <View style={styles.componentRow}>
              <Button title="Full Width" fullWidth onPress={() => {}} />
            </View>
            
            <View style={styles.componentRow}>
              <Button title="Disabled Button" disabled onPress={() => {}} />
            </View>
          </View>
        )}
        
        {activeTab === 'inputs' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Input Components</Text>
            
            <View style={styles.componentRow}>
              <Input 
                label="Default Input" 
                placeholder="Enter text here" 
                value={inputValue} 
                onChangeText={setInputValue} 
              />
            </View>
            
            <View style={styles.componentRow}>
              <Input 
                label="Filled Input" 
                placeholder="Enter text here" 
                value={inputValue} 
                onChangeText={setInputValue} 
                variant="filled"
              />
            </View>
            
            <View style={styles.componentRow}>
              <Input 
                label="Outline Input" 
                placeholder="Enter text here" 
                value={inputValue} 
                onChangeText={setInputValue} 
                variant="outline"
              />
            </View>
            
            <View style={styles.componentRow}>
              <Input 
                label="With Error" 
                placeholder="Enter text here" 
                value={inputValue} 
                onChangeText={setInputValue} 
                error="This field is required"
              />
            </View>
            
            <View style={styles.componentRow}>
              <Input 
                label="Multiline Input" 
                placeholder="Enter multiple lines of text" 
                value={inputValue} 
                onChangeText={setInputValue} 
                multiline
                numberOfLines={4}
              />
            </View>
            
            <View style={styles.componentRow}>
              <Input 
                label="Password Input" 
                placeholder="Enter password" 
                value={inputValue} 
                onChangeText={setInputValue} 
                secureTextEntry
              />
            </View>
            
            <View style={styles.componentRow}>
              <Input 
                label="Disabled Input" 
                placeholder="Cannot be edited" 
                value="Disabled input value" 
                onChangeText={setInputValue} 
                editable={false}
              />
            </View>
          </View>
        )}
        
        {activeTab === 'cards' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Card Components</Text>
            
            <View style={styles.componentRow}>
              <Card title="Default Card">
                <Text>This is a default card with a title.</Text>
              </Card>
            </View>
            
            <View style={styles.componentRow}>
              <Card title="Card with Subtitle" subtitle="This is a subtitle">
                <Text>This card has both a title and subtitle.</Text>
              </Card>
            </View>
            
            <View style={styles.componentRow}>
              <Card variant="elevated">
                <Text>This is an elevated card without a title.</Text>
              </Card>
            </View>
            
            <View style={styles.componentRow}>
              <Card variant="outlined" title="Outlined Card">
                <Text>This is an outlined card with a border instead of a shadow.</Text>
              </Card>
            </View>
          </View>
        )}
        
        {activeTab === 'badges' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Badge Components</Text>
            
            <View style={styles.badgeContainer}>
              <Badge text="Default" />
              <Badge text="Primary" variant="primary" />
              <Badge text="Secondary" variant="secondary" />
              <Badge text="Success" variant="success" />
              <Badge text="Warning" variant="warning" />
              <Badge text="Danger" variant="danger" />
              <Badge text="Info" variant="info" />
            </View>
            
            <Text style={styles.subSectionTitle}>Badge Sizes</Text>
            <View style={styles.badgeContainer}>
              <Badge text="Small" size="small" variant="primary" />
              <Badge text="Medium" size="medium" variant="primary" />
              <Badge text="Large" size="large" variant="primary" />
            </View>
            
            <Text style={styles.subSectionTitle}>With Icons</Text>
            <View style={styles.badgeContainer}>
              <Badge text="With Icon" icon="star" variant="primary" />
            </View>
            
            <Text style={styles.subSectionTitle}>Difficulty Badges</Text>
            <View style={styles.badgeContainer}>
              <DifficultyBadge difficulty="beginner" />
              <DifficultyBadge difficulty="intermediate" />
              <DifficultyBadge difficulty="advanced" />
            </View>
            
            <Text style={styles.subSectionTitle}>Muscle Group Badges</Text>
            <View style={styles.badgeContainer}>
              <MuscleGroupBadge muscleGroup="chest" />
              <MuscleGroupBadge muscleGroup="back" />
              <MuscleGroupBadge muscleGroup="shoulders" />
              <MuscleGroupBadge muscleGroup="arms" />
              <MuscleGroupBadge muscleGroup="legs" />
              <MuscleGroupBadge muscleGroup="core" />
              <MuscleGroupBadge muscleGroup="cardio" />
            </View>
          </View>
        )}
        
        {activeTab === 'progress' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Progress Components</Text>
            
            <Text style={styles.subSectionTitle}>Progress Bars</Text>
            <View style={styles.componentRow}>
              <ProgressBar progress={0.25} label="25% Complete" showPercentage />
            </View>
            
            <View style={styles.componentRow}>
              <ProgressBar progress={0.5} variant="secondary" label="50% Complete" showPercentage />
            </View>
            
            <View style={styles.componentRow}>
              <ProgressBar progress={0.75} variant="success" label="75% Complete" showPercentage />
            </View>
            
            <View style={styles.componentRow}>
              <ProgressBar progress={1} variant="danger" label="100% Complete" showPercentage />
            </View>
            
            <Text style={styles.subSectionTitle}>Loading Spinners</Text>
            <View style={styles.spinnerContainer}>
              <LoadingSpinner size="small" />
              <LoadingSpinner size="large" />
              <LoadingSpinner text="Loading..." />
            </View>
          </View>
        )}
        
        {activeTab === 'navigation' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Navigation Components</Text>
            
            <Text style={styles.subSectionTitle}>Tab Bar Variants</Text>
            <View style={styles.componentRow}>
              <TabBar 
                tabs={[
                  { key: 'tab1', label: 'Tab 1' },
                  { key: 'tab2', label: 'Tab 2' },
                  { key: 'tab3', label: 'Tab 3' },
                ]} 
                activeTab="tab1" 
                onTabChange={() => {}} 
                variant="default"
              />
            </View>
            
            <View style={styles.componentRow}>
              <TabBar 
                tabs={[
                  { key: 'tab1', label: 'Tab 1' },
                  { key: 'tab2', label: 'Tab 2' },
                  { key: 'tab3', label: 'Tab 3' },
                ]} 
                activeTab="tab2" 
                onTabChange={() => {}} 
                variant="pills"
              />
            </View>
            
            <View style={styles.componentRow}>
              <TabBar 
                tabs={[
                  { key: 'tab1', label: 'Tab 1' },
                  { key: 'tab2', label: 'Tab 2' },
                  { key: 'tab3', label: 'Tab 3' },
                ]} 
                activeTab="tab3" 
                onTabChange={() => {}} 
                variant="underlined"
              />
            </View>
            
            <Text style={styles.subSectionTitle}>List Items</Text>
            <View style={styles.componentRow}>
              <ListItem 
                title="Basic List Item" 
                onPress={() => {}} 
              />
            </View>
            
            <View style={styles.componentRow}>
              <ListItem 
                title="With Subtitle" 
                subtitle="This is a subtitle" 
                onPress={() => {}} 
              />
            </View>
            
            <View style={styles.componentRow}>
              <ListItem 
                title="With Left Icon" 
                leftIcon="user" 
                onPress={() => {}} 
              />
            </View>
            
            <View style={styles.componentRow}>
              <ListItem 
                title="Custom Right Icon" 
                rightIcon="cog" 
                onPress={() => {}} 
              />
            </View>
            
            <Text style={styles.subSectionTitle}>Empty State</Text>
            <View style={styles.componentRow}>
              <EmptyState 
                title="No Items Found" 
                message="Try adjusting your search or filters to find what you're looking for." 
                icon="search" 
                buttonText="Clear Filters" 
                onButtonPress={() => {}} 
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: typography.fontSizeXXLarge,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
    padding: spacing.md,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSizeLarge,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  subSectionTitle: {
    fontSize: typography.fontSizeMedium,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  componentRow: {
    marginBottom: spacing.md,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  spinnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: spacing.md,
  },
});

export default ComponentTestPage;
