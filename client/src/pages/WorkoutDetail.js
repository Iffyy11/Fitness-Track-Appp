import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Calendar, Clock, Flame, Target, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import './Pages.css';

const WorkoutDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchWorkout();
  }, [id, user, navigate]);

  const fetchWorkout = async () => {
    try {
      const response = await api.getWorkout(id);
      setWorkout(response.data);
    } catch (error) {
      console.error('Error fetching workout:', error);
      navigate('/workouts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await api.deleteWorkout(id);
        navigate('/workouts');
      } catch (error) {
        console.error('Error deleting workout:', error);
        alert('Failed to delete workout');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading workout...</div>;
  }

  if (!workout) {
    return <div className="loading">Workout not found</div>;
  }

  return (
    <div className="workout-detail-page">
      <div className="container">
        <header className="detail-header">
          <button onClick={() => navigate('/workouts')} className="back-btn">
            <ArrowLeft size={20} />
            Back to Workouts
          </button>
          <div className="header-actions">
            <button className="btn btn-secondary">
              <Edit size={16} />
              Edit
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </header>

        <div className="workout-detail-content">
          <div className="workout-header">
            <h1>{workout.name}</h1>
            <div className="workout-date">
              <Calendar size={20} />
              <span>{formatDate(workout.date)}</span>
            </div>
          </div>

          {workout.description && (
            <div className="workout-description">
              <p>{workout.description}</p>
            </div>
          )}

          <div className="workout-stats-detail">
            {workout.duration_minutes && (
              <div className="stat-item">
                <Clock size={24} />
                <div>
                  <span className="stat-value">{workout.duration_minutes}</span>
                  <span className="stat-label">Minutes</span>
                </div>
              </div>
            )}
            {workout.calories_burned && (
              <div className="stat-item">
                <Flame size={24} />
                <div>
                  <span className="stat-value">{workout.calories_burned}</span>
                  <span className="stat-label">Calories</span>
                </div>
              </div>
            )}
            <div className="stat-item">
              <Target size={24} />
              <div>
                <span className="stat-value">{workout.exercises?.length || 0}</span>
                <span className="stat-label">Exercises</span>
              </div>
            </div>
          </div>

          {workout.exercises && workout.exercises.length > 0 && (
            <div className="exercises-section">
              <h2>Exercises</h2>
              <div className="exercises-list">
                {workout.exercises.map((exercise, index) => (
                  <div key={exercise.id} className="exercise-item">
                    <div className="exercise-number">{index + 1}</div>
                    <div className="exercise-details">
                      <h3>{exercise.exercise_name}</h3>
                      <div className="exercise-metrics">
                        {exercise.sets && (
                          <span className="metric">
                            <strong>{exercise.sets}</strong> sets
                          </span>
                        )}
                        {exercise.reps && (
                          <span className="metric">
                            <strong>{exercise.reps}</strong> reps
                          </span>
                        )}
                        {exercise.weight && (
                          <span className="metric">
                            <strong>{exercise.weight}</strong> kg
                          </span>
                        )}
                        {exercise.duration_seconds && (
                          <span className="metric">
                            <strong>{Math.floor(exercise.duration_seconds / 60)}</strong> min
                          </span>
                        )}
                        {exercise.distance && (
                          <span className="metric">
                            <strong>{exercise.distance}</strong> km
                          </span>
                        )}
                      </div>
                      {exercise.notes && (
                        <p className="exercise-notes">{exercise.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {workout.notes && (
            <div className="workout-notes-section">
              <h2>Notes</h2>
              <div className="workout-notes">
                <p>{workout.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetail;