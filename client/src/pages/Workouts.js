import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import WorkoutCard from '../components/WorkoutCard';
import { Plus, Search, Filter } from 'lucide-react';
import './Pages.css';

const Workouts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchWorkouts();
  }, [user, navigate]);

  useEffect(() => {
    // Filter workouts based on search term
    const filtered = workouts.filter(workout =>
      workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (workout.description && workout.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredWorkouts(filtered);
  }, [workouts, searchTerm]);

  const fetchWorkouts = async () => {
    try {
      const response = await api.getWorkouts(user.id);
      setWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkout = async (workoutId) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await api.deleteWorkout(workoutId);
        setWorkouts(workouts.filter(w => w.id !== workoutId));
      } catch (error) {
        console.error('Error deleting workout:', error);
        alert('Failed to delete workout');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading workouts...</div>;
  }

  return (
    <div className="workouts-page">
      <div className="container">
        <header className="page-header">
          <h1>My Workouts</h1>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/create-workout')}
          >
            <Plus size={20} />
            New Workout
          </button>
        </header>

        <div className="search-filter-bar">
          <div className="search-box">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search workouts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredWorkouts.length > 0 ? (
          <div className="workouts-grid">
            {filteredWorkouts.map(workout => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onClick={() => navigate(`/workouts/${workout.id}`)}
                onDelete={handleDeleteWorkout}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            {searchTerm ? (
              <p>No workouts found matching "{searchTerm}"</p>
            ) : (
              <>
                <p>No workouts yet. Create your first workout to get started!</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/create-workout')}
                >
                  Create Your First Workout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Workouts;