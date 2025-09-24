import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import WorkoutCard from '../components/WorkoutCard';
import { Plus, TrendingUp, Calendar, Target } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalCalories: 0,
    thisWeekWorkouts: 0,
    avgDuration: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      const response = await api.getWorkouts(user.id);
      const workouts = response.data;
      
      // Get recent workouts (last 5)
      setRecentWorkouts(workouts.slice(0, 5));
      
      // Calculate stats
      const totalWorkouts = workouts.length;
      const totalCalories = workouts.reduce((sum, w) => sum + (w.calories_burned || 0), 0);
      const totalDuration = workouts.reduce((sum, w) => sum + (w.duration_minutes || 0), 0);
      const avgDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;
      
      // This week's workouts
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const thisWeekWorkouts = workouts.filter(w => 
        new Date(w.date) >= oneWeekAgo
      ).length;
      
      setStats({
        totalWorkouts,
        totalCalories,
        thisWeekWorkouts,
        avgDuration
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <header className="dashboard-header">
          <h1>Welcome back, {user?.first_name}!</h1>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/create-workout')}
          >
            <Plus size={20} />
            New Workout
          </button>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Target />
            </div>
            <div className="stat-content">
              <h3>{stats.totalWorkouts}</h3>
              <p>Total Workouts</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp />
            </div>
            <div className="stat-content">
              <h3>{stats.totalCalories}</h3>
              <p>Calories Burned</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Calendar />
            </div>
            <div className="stat-content">
              <h3>{stats.thisWeekWorkouts}</h3>
              <p>This Week</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp />
            </div>
            <div className="stat-content">
              <h3>{stats.avgDuration}</h3>
              <p>Avg Duration (min)</p>
            </div>
          </div>
        </div>

        <section className="recent-workouts">
          <div className="section-header">
            <h2>Recent Workouts</h2>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/workouts')}
            >
              View All
            </button>
          </div>
          
          {recentWorkouts.length > 0 ? (
            <div className="workouts-grid">
              {recentWorkouts.map(workout => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onClick={() => navigate(`/workouts/${workout.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No workouts yet. Start your fitness journey today!</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/create-workout')}
              >
                Create Your First Workout
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;