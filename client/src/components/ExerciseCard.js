import React from 'react';
import { Dumbbell, Clock, Target, Repeat } from 'lucide-react';
import './ExerciseCard.css';

const ExerciseCard = ({ exercise, onClick, showDetails = true }) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'strength':
        return <Dumbbell size={20} />;
      case 'cardio':
        return <Target size={20} />;
      default:
        return <Dumbbell size={20} />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return '#28a745';
      case 'intermediate':
        return '#ffc107';
      case 'advanced':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  return (
    <div className="exercise-card" onClick={onClick}>
      <div className="exercise-card-header">
        <div className="exercise-info">
          <div className="exercise-category">
            {getCategoryIcon(exercise.category)}
            <span>{exercise.category}</span>
          </div>
          <h3 className="exercise-name">{exercise.name}</h3>
        </div>
        <div 
          className="difficulty-badge"
          style={{ backgroundColor: getDifficultyColor(exercise.difficulty_level) }}
        >
          {exercise.difficulty_level}
        </div>
      </div>
      
      {showDetails && (
        <>
          <div className="exercise-description">
            {exercise.description}
          </div>
          
          {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
            <div className="muscle-groups">
              <strong>Target Muscles:</strong>
              <div className="muscle-tags">
                {exercise.muscle_groups.map((muscle, index) => (
                  <span key={index} className="muscle-tag">
                    {muscle.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {exercise.equipment && (
            <div className="equipment">
              <strong>Equipment:</strong> {exercise.equipment}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExerciseCard;