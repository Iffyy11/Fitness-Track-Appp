
import React from 'react';
import { Calendar, Clock, Flame, Target } from 'lucide-react';
import './WorkoutCard.css';

const WorkoutCard = ({ workout, onClick, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="workout-card" onClick={onClick}>
      <div className="workout-card-header">
        <h3 className="workout-name">{workout.name}</h3>
        <div className="workout-date">
          <Calendar size={16} />
          <span>{formatDate(workout.date)}</span>
        </div>
      </div>
      
      <div className="workout-description">
        {workout.description}
      </div>
      
      <div className="workout-stats">
        {workout.duration_minutes && (
          <div className="stat">
            <Clock size={16} />
            <span>{workout.duration_minutes} min</span>
          </div>
        )}
        {workout.calories_burned && (
          <div className="stat">
            <Flame size={16} />
            <span>{workout.calories_burned} cal</span>
          </div>
        )}
        <div className="stat">
          <Target size={16} />
          <span>{workout.exercises?.length || 0} exercises</span>
        </div>
      </div>
      
      {workout.notes && (
        <div className="workout-notes">
          <strong>Notes:</strong> {workout.notes}
        </div>
      )}
      
      {onDelete && (
        <button 
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(workout.id);
          }}
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default WorkoutCard;