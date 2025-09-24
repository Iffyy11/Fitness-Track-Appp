import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Play, Pause, Square, SkipForward, Timer, CheckCircle } from 'lucide-react';
import './WorkoutSession.css';

const WorkoutSession = () => {
  const { workoutId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [workout, setWorkout] = useState(state?.workout || null);
  const [template, setTemplate] = useState(state?.template || null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [exerciseTime, setExerciseTime] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [completedExercises, setCompletedExercises] = useState(new Set());
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!workout || !template) {
      navigate('/templates');
      return;
    }
  }, [user, workout, template, navigate]);

  // Timer effects
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        if (isResting) {
          setRestTime(prev => {
            if (prev <= 1) {
              setIsResting(false);
              setRestTime(0);
              return 0;
            }
            return prev - 1;
          });
        } else {
          setExerciseTime(prev => prev + 1);
        }
        
        if (workoutStartTime) {
          setTotalElapsedTime(Math.floor((Date.now() - workoutStartTime) / 1000));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isResting, workoutStartTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentExercise = template?.exercises?.[currentExerciseIndex];
  const isWorkoutComplete = completedExercises.size === template?.exercises?.length;

  const startWorkout = () => {
    setIsRunning(true);
    if (!workoutStartTime) {
      setWorkoutStartTime(Date.now());
    }
  };

  const pauseWorkout = () => {
    setIsRunning(false);
  };

  const stopWorkout = () => {
    setIsRunning(false);
    setExerciseTime(0);
    setRestTime(0);
    setIsResting(false);
    // Could save workout progress here
    navigate('/dashboard');
  };

  const completeCurrentExercise = () => {
    if (!currentExercise) return;
    
    setCompletedExercises(prev => new Set([...prev, currentExerciseIndex]));
    
    // Start rest period if there's a next exercise
    if (currentExerciseIndex < template.exercises.length - 1) {
      const restSeconds = currentExercise.rest_seconds || 60;
      setRestTime(restSeconds);
      setIsResting(true);
      setExerciseTime(0);
    } else {
      // Workout complete
      setIsRunning(false);
      setExerciseTime(0);
    }
  };

  const skipToNextExercise = () => {
    if (currentExerciseIndex < template.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setExerciseTime(0);
      setRestTime(0);
      setIsResting(false);
    }
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTime(0);
    skipToNextExercise();
  };

  if (!workout || !template) {
    return <div className="loading">Loading workout...</div>;
  }

  return (
    <div className="workout-session">
      <div className="container">
        <div className="workout-header">
          <div className="workout-info">
            <h1>{template.name}</h1>
            <div className="workout-stats">
              <div className="stat">
                <Timer size={16} />
                <span>Total: {formatTime(totalElapsedTime)}</span>
              </div>
              <div className="stat">
                <CheckCircle size={16} />
                <span>{completedExercises.size}/{template.exercises.length} completed</span>
              </div>
            </div>
          </div>
          
          <div className="workout-controls">
            <button 
              className={`btn ${isRunning ? 'btn-warning' : 'btn-primary'}`}
              onClick={isRunning ? pauseWorkout : startWorkout}
              disabled={isWorkoutComplete}
            >
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button className="btn btn-secondary" onClick={stopWorkout}>
              <Square size={20} />
              Stop
            </button>
          </div>
        </div>

        {isWorkoutComplete ? (
          <div className="workout-complete">
            <div className="completion-card">
              <CheckCircle size={64} className="completion-icon" />
              <h2>Workout Complete!</h2>
              <p>Great job! You've completed all exercises.</p>
              <div className="completion-stats">
                <div className="completion-stat">
                  <strong>Total Time:</strong>
                  <span>{formatTime(totalElapsedTime)}</span>
                </div>
                <div className="completion-stat">
                  <strong>Exercises:</strong>
                  <span>{template.exercises.length}</span>
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <>
            {isResting ? (
              <div className="rest-period">
                <div className="rest-card">
                  <h2>Rest Time</h2>
                  <div className="rest-timer">
                    <div className="timer-circle">
                      <span className="timer-text">{formatTime(restTime)}</span>
                    </div>
                  </div>
                  <p>Get ready for the next exercise</p>
                  <div className="rest-controls">
                    <button className="btn btn-secondary" onClick={skipRest}>
                      Skip Rest
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="exercise-session">
                <div className="exercise-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${((currentExerciseIndex + 1) / template.exercises.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    Exercise {currentExerciseIndex + 1} of {template.exercises.length}
                  </span>
                </div>

                {currentExercise && (
                  <div className="current-exercise">
                    <div className="exercise-header">
                      <h2>{currentExercise.exercise_name}</h2>
                      <div className="exercise-timer">
                        <Timer size={24} />
                        <span className="timer-display">{formatTime(exerciseTime)}</span>
                      </div>
                    </div>

                    <div className="exercise-details">
                      {currentExercise.exercise_description && (
                        <p className="exercise-description">{currentExercise.exercise_description}</p>
                      )}
                      
                      <div className="exercise-specs">
                        {currentExercise.sets && (
                          <div className="spec">
                            <strong>Sets:</strong> {currentExercise.sets}
                          </div>
                        )}
                        {currentExercise.reps && (
                          <div className="spec">
                            <strong>Reps:</strong> {currentExercise.reps}
                          </div>
                        )}
                        {currentExercise.duration_seconds && (
                          <div className="spec">
                            <strong>Duration:</strong> {formatTime(currentExercise.duration_seconds)}
                          </div>
                        )}
                        {currentExercise.rest_seconds && (
                          <div className="spec">
                            <strong>Rest After:</strong> {formatTime(currentExercise.rest_seconds)}
                          </div>
                        )}
                      </div>

                      {currentExercise.exercise_instructions && (
                        <div className="exercise-instructions">
                          <h4>Instructions:</h4>
                          <p>{currentExercise.exercise_instructions}</p>
                        </div>
                      )}
                    </div>

                    <div className="exercise-controls">
                      <button 
                        className="btn btn-success btn-large"
                        onClick={completeCurrentExercise}
                        disabled={!isRunning}
                      >
                        <CheckCircle size={20} />
                        Complete Exercise
                      </button>
                      
                      {currentExerciseIndex < template.exercises.length - 1 && (
                        <button 
                          className="btn btn-secondary"
                          onClick={skipToNextExercise}
                        >
                          <SkipForward size={20} />
                          Skip
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Exercise list sidebar */}
        <div className="exercise-list">
          <h3>Workout Plan</h3>
          <div className="exercises">
            {template.exercises.map((exercise, index) => (
              <div 
                key={exercise.id}
                className={`exercise-item ${index === currentExerciseIndex ? 'current' : ''} ${
                  completedExercises.has(index) ? 'completed' : ''
                }`}
              >
                <div className="exercise-number">{index + 1}</div>
                <div className="exercise-info">
                  <span className="exercise-name">{exercise.exercise_name}</span>
                  <div className="exercise-meta">
                    {exercise.sets && <span>{exercise.sets} sets</span>}
                    {exercise.reps && <span>{exercise.reps} reps</span>}
                    {exercise.duration_seconds && <span>{formatTime(exercise.duration_seconds)}</span>}
                  </div>
                </div>
                {completedExercises.has(index) && (
                  <CheckCircle size={16} className="completed-icon" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutSession;