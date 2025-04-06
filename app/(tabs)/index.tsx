import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSupabase } from '../lib/SupabaseContext';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { UserProgress, WorkoutLog } from '../lib/database.types';
import { colors, typography, spacing, commonStyles } from '../lib/styles';
import Card from '../components/Card';
import { SectionHeader } from '../components/Navigation';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutLog[]>([]);
  const [progressData, setProgressData] = useState<UserProgress[]>([]);
  const [workoutStats, setWorkoutStats] = useState({
    totalWorkouts: 0,
    thisWeek: 0,
    thisMonth: 0,
    avgDuration: 0
  });
  
  const supabase = useSupabase();
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');
      
      // Fetch recent workouts
      const { data: workoutsData, error: workoutsError } = await supabase
        .from('workout_logs')
        .select(`
          *,
          workout:workouts(name, difficulty)
        `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(5);
        
      if (workoutsError) throw workoutsError;
      
      setRecentWorkouts(workoutsData || []);
      
      // Fetch progress data
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true })
        .limit(10);
        
      if (progressError) throw progressError;
      
      setProgressData(progressData || []);
      
      // Calculate workout stats
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const { data: statsData, error: statsError } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', user.id)
        .not('completed_at', 'is', null);
        
      if (statsError) throw statsError;
      
      if (statsData) {
        const totalWorkouts = statsData.length;
        
        const thisWeekWorkouts = statsData.filter(log => 
          new Date(log.completed_at) >= startOfWeek
        ).length;
        
        const thisMonthWorkouts = statsData.filter(log => 
          new Date(log.completed_at) >= startOfMonth
        ).length;
        
        const totalDuration = statsData.reduce((sum, log) => sum + (log.duration || 0), 0);
        const avgDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;
        
        setWorkoutStats({
          totalWorkouts,
          thisWeek: thisWeekWorkouts,
          thisMonth: thisMonthWorkouts,
          avgDuration
        });
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
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

  // Prepare chart data for weight progress
  const weightData = {
    labels: progressData.map(item => {
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        data: progressData.map(item => item.weight || 0),
        color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ["Weight (kg)"]
  };

  return (
    <ScrollView style={commonStyles.container}>
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Text style={commonStyles.statValue}>{workoutStats.totalWorkouts}</Text>
          <Text style={commonStyles.statLabel}>Total Workouts</Text>
        </Card>
        
        <Card style={styles.statCard}>
          <Text style={commonStyles.statValue}>{workoutStats.thisWeek}</Text>
          <Text style={commonStyles.statLabel}>This Week</Text>
        </Card>
        
        <Card style={styles.statCard}>
          <Text style={commonStyles.statValue}>{workoutStats.thisMonth}</Text>
          <Text style={commonStyles.statLabel}>This Month</Text>
        </Card>
        
        <Card style={styles.statCard}>
          <Text style={commonStyles.statValue}>{workoutStats.avgDuration}</Text>
          <Text style={commonStyles.statLabel}>Avg. Minutes</Text>
        </Card>
      </View>
      
      <Card title="Weight Progress">
        {progressData.length > 0 ? (
          <LineChart
            data={weightData}
            width={screenWidth - 50}
            height={220}
            chartConfig={{
              backgroundColor: colors.card,
              backgroundGradientFrom: colors.card,
              backgroundGradientTo: colors.card,
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
              labelColor: (opacity = 1) => colors.dark,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: colors.primary
              }
            }}
            bezier
            style={styles.chart}
          />
        ) : (
          <Text style={commonStyles.emptyState}>No weight data recorded yet</Text>
        )}
      </Card>
      
      <Card title="Recent Workouts">
        {recentWorkouts.length === 0 ? (
          <Text style={commonStyles.emptyState}>No workouts completed yet</Text>
        ) : (
          recentWorkouts.map((workout) => (
            <TouchableOpacity 
              key={workout.id} 
              style={styles.workoutItem}
              onPress={() => router.push(`/workout/${workout.workout_id}`)}
            >
              <View style={styles.workoutHeader}>
                <Text style={styles.workoutName}>{workout.workout?.name || 'Unnamed Workout'}</Text>
                <Text style={styles.workoutDate}>
                  {new Date(workout.completed_at).toLocaleDateString()}
                </Text>
              </View>
              
              <View style={styles.workoutDetails}>
                {workout.duration && (
                  <View style={styles.workoutDetail}>
                    <FontAwesome name="clock-o" size={14} color={colors.gray} style={styles.detailIcon} />
                    <Text style={styles.detailValue}>{workout.duration} min</Text>
                  </View>
                )}
                
                {workout.workout?.difficulty && (
                  <View style={styles.workoutDetail}>
                    <FontAwesome name="signal" size={14} color={colors.gray} style={styles.detailIcon} />
                    <Text style={styles.detailValue}>
                      {workout.workout.difficulty.charAt(0).toUpperCase() + workout.workout.difficulty.slice(1)}
                    </Text>
                  </View>
                )}
                
                {workout.rating && (
                  <View style={styles.workoutDetail}>
                    <FontAwesome name="star" size={14} color={colors.gray} style={styles.detailIcon} />
                    <Text style={styles.detailValue}>{workout.rating}/5</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  chart: {
    marginVertical: spacing.sm,
    borderRadius: 16,
  },
  workoutItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  workoutName: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    color: colors.dark,
  },
  workoutDate: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray,
  },
  workoutDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  workoutDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  detailIcon: {
    marginRight: spacing.xs,
  },
  detailValue: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray,
  },
});
