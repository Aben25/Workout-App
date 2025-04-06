import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { useSupabase } from '../lib/SupabaseContext';
import { LineChart } from 'react-native-chart-kit';
import { UserProgress, WorkoutLog } from '../../lib/database.types';

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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{workoutStats.totalWorkouts}</Text>
          <Text style={styles.statLabel}>Total Workouts</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{workoutStats.thisWeek}</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{workoutStats.thisMonth}</Text>
          <Text style={styles.statLabel}>This Month</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{workoutStats.avgDuration}</Text>
          <Text style={styles.statLabel}>Avg. Minutes</Text>
        </View>
      </View>
      
      {progressData.length > 0 ? (
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Weight Progress</Text>
          <LineChart
            data={weightData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#3498db"
              }
            }}
            bezier
            style={styles.chart}
          />
        </View>
      ) : (
        <View style={styles.emptyChartContainer}>
          <Text style={styles.sectionTitle}>Weight Progress</Text>
          <Text style={styles.emptyText}>No weight data recorded yet</Text>
        </View>
      )}
      
      <View style={styles.recentWorkoutsContainer}>
        <Text style={styles.sectionTitle}>Recent Workouts</Text>
        
        {recentWorkouts.length === 0 ? (
          <Text style={styles.emptyText}>No workouts completed yet</Text>
        ) : (
          recentWorkouts.map((workout) => (
            <View key={workout.id} style={styles.workoutItem}>
              <View style={styles.workoutHeader}>
                <Text style={styles.workoutName}>{workout.workout?.name || 'Unnamed Workout'}</Text>
                <Text style={styles.workoutDate}>
                  {new Date(workout.completed_at).toLocaleDateString()}
                </Text>
              </View>
              
              <View style={styles.workoutDetails}>
                {workout.duration && (
                  <View style={styles.workoutDetail}>
                    <Text style={styles.detailLabel}>Duration</Text>
                    <Text style={styles.detailValue}>{workout.duration} min</Text>
                  </View>
                )}
                
                {workout.workout?.difficulty && (
                  <View style={styles.workoutDetail}>
                    <Text style={styles.detailLabel}>Difficulty</Text>
                    <Text style={styles.detailValue}>
                      {workout.workout.difficulty.charAt(0).toUpperCase() + workout.workout.difficulty.slice(1)}
                    </Text>
                  </View>
                )}
                
                {workout.rating && (
                  <View style={styles.workoutDetail}>
                    <Text style={styles.detailLabel}>Rating</Text>
                    <Text style={styles.detailValue}>{workout.rating}/5</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
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
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyChartContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginVertical: 20,
  },
  recentWorkoutsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  workoutItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 15,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  workoutDate: {
    fontSize: 14,
    color: '#999',
  },
  workoutDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  workoutDetail: {
    marginRight: 20,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});
