import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import ExerciseCard from '../components/ExerciseCard';
import { ArrowLeft, Plus, Save, X } from 'lucide-react';
import './Pages.css';

const CreateWorkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exercisesLoading, setExercisesLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      date: new Date().toISOString().split('T')[0]
    }
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const fetchExercises = async () => {
    setExercisesLoading(true);
    try {
      const response = await api.getExercises();
      setExercises(response.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setExercisesLoading(false);
    }
  };

  const handleShowExerciseLibrary = () => {
    if (exercises.length === 0) {
      fetchExercises();
    }
    setShowExerciseLibrary(true);
  };

  const handleAddExercise = (exercise) => {
    const exerciseData = {
      exercise_id: exercise.id,
      exercise_name: exercise.name,
      sets: '',
      reps: '',
      weight: '',
      duration_seconds: '',
      distance: '',
      notes: ''
    };
    setSelectedExercises([...selectedExercises, exerciseData]);
    setShowExerciseLibrary(false);
  };

  const handleRemoveExercise = (index) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const handleExerciseChange = (index, field, value) => {
    const updated = [...selectedExercises];
    updated[index][field] = value;
    setSelectedExercises(updated);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      const workoutData = {
        ...data,
        user_id: user.id,
        exercises: selectedExercises.map(ex => ({
          exercise_id: ex.exercise_id,
          sets: ex.sets ? parseInt(ex.sets) : null,
          reps: ex.reps ? parseInt(ex.reps) : null,
          weight: ex.weight ? parseFloat(ex.weight) : null,
          duration_seconds: ex.duration_seconds ? parseInt(ex.duration_seconds) : null,
          distance: ex.distance ? parseFloat(ex.distance) : null,
          notes: ex.notes || null
        }))
      };

      const response = await api.createWorkout(workoutData);
      navigate(`/workouts/${response.data.workout.id}`);
    } catch (error) {
      console.error('Error creating workout:', error);
      alert('Failed to create workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-workout-page">
      <div className="container">
        <header className="page-header">
          <button onClick={() => navigate('/workouts')} className="back-btn">
            <ArrowLeft size={20} />
            Back to Workouts
          </button>
          <h1>Create New Workout</h1>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="create-workout-form">
          <div className="workout-details-section">
            <h2>Workout Details</h2>
            
            <div className="form-group">
              <label htmlFor="name">Workout Name *</label>
              <input
                type="text"
                id="name"
                {...register('name', { required: 'Workout name is required' })}
                placeholder="Enter workout name"
              />
              {errors.name && <div className="error-message">{errors.name.message}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                {...register('description')}
                placeholder="Describe your workout..."
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  {...register('date', { required: 'Date is required' })}
                />
                {errors.date && <div className="error-message">{errors.date.message}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="duration_minutes">Duration (minutes)</label>
                <input
                  type="number"
                  id="duration_minutes"
                  {...register('duration_minutes')}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="calories_burned">Calories Burned</label>
                <input
                  type="number"
                  id="calories_burned"
                  {...register('calories_burned')}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                {...register('notes')}
                placeholder="Add any additional notes..."
                rows="3"
              />
            </div>
          </div>

          <div className="exercises-section">
            <div className="section-header">
              <h2>Exercises</h2>
              <button 
                type="button"
                className="btn btn-secondary"
                onClick={handleShowExerciseLibrary}
              >
                <Plus size={16} />
                Add Exercise
              </button>
            </div>

            {selectedExercises.length > 0 ? (
              <div className="selected-exercises">
                {selectedExercises.map((exercise, index) => (
                  <div key={index} className="exercise-form-item">
                    <div className="exercise-header">
                      <h3>{exercise.exercise_name}</h3>
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => handleRemoveExercise(index)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    <div className="exercise-inputs">
                      <div className="input-group">
                        <label>Sets</label>
                        <input
                          type="number"
                          value={exercise.sets}
                          onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      
                      <div className="input-group">
                        <label>Reps</label>
                        <input
                          type="number"
                          value={exercise.reps}
                          onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      
                      <div className="input-group">
                        <label>Weight (kg)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={exercise.weight}
                          onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      
                      <div className="input-group">
                        <label>Duration (sec)</label>
                        <input
                          type="number"
                          value={exercise.duration_seconds}
                          onChange={(e) => handleExerciseChange(index, 'duration_seconds', e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      
                      <div className="input-group">
                        <label>Distance (km)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={exercise.distance}
                          onChange={(e) => handleExerciseChange(index, 'distance', e.target.value)}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    
                    <div className="exercise-notes">
                      <label>Notes</label>
                      <textarea
                        value={exercise.notes}
                        onChange={(e) => handleExerciseChange(index, 'notes', e.target.value)}
                        placeholder="Add notes for this exercise..."
                        rows="2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-exercises">
                <p>No exercises added yet. Click "Add Exercise" to get started.</p>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/workouts')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} />
              {loading ? 'Creating...' : 'Create Workout'}
            </button>
          </div>
        </form>

        {/* Exercise Library Modal */}
        {showExerciseLibrary && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Select Exercise</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowExerciseLibrary(false)}
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="modal-content">
                {exercisesLoading ? (
                  <div className="loading">Loading exercises...</div>
                ) : (
                  <div className="exercises-grid">
                    {exercises.map(exercise => (
                      <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        onClick={() => handleAddExercise(exercise)}
                        showDetails={false}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateWorkout;