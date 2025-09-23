
import React from 'react';
import { Play, Clock, Flame, Users, Dumbbell } from 'lucide-react';
import './WorkoutTemplateCard.css';

const WorkoutTemplateCard = ({ template, onStartWorkout, onViewDetails }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '#22c55e';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'strength': return <Dumbbell size={16} />;
      case 'cardio': return <Users size={16} />;
      case 'hiit': return <Flame size={16} />;
      default: return <Play size={16} />;
    }
  };

  return (
    <div className="workout-template-card">
      <div className="template-image-container">
        <img 
          src={template.image_url} 
          alt={template.name}
          className="template-image"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop';
          }}
        />
        <div className="template-overlay">
          <div className="template-category">
            {getCategoryIcon(template.category)}
            <span>{template.category}</span>
          </div>
          <div 
            className="template-difficulty"
            style={{ backgroundColor: getDifficultyColor(template.difficulty_level) }}
          >
            {template.difficulty_level}
          </div>
        </div>
      </div>

      <div className="template-content">
        <div className="template-header">
          <h3 className="template-name">{template.name}</h3>
          <div className="template-stats">
            <div className="stat">
              <Clock size={14} />
              <span>{template.estimated_duration_minutes} min</span>
            </div>
            <div className="stat">
              <Flame size={14} />
              <span>{template.estimated_calories || 'N/A'} cal</span>
            </div>
          </div>
        </div>

        <p className="template-description">{template.description}</p>

        <div className="template-details">
          {template.target_muscle_groups && template.target_muscle_groups.length > 0 && (
            <div className="muscle-groups">
              <strong>Target:</strong>
              <div className="muscle-tags">
                {template.target_muscle_groups.slice(0, 3).map((muscle, index) => (
                  <span key={index} className="muscle-tag">
                    {muscle.trim()}
                  </span>
                ))}
                {template.target_muscle_groups.length > 3 && (
                  <span className="muscle-tag more">
                    +{template.target_muscle_groups.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {template.equipment_needed && template.equipment_needed.length > 0 && (
            <div className="equipment">
              <strong>Equipment:</strong>
              <span className="equipment-text">
                {template.equipment_needed.join(', ') || 'None'}
              </span>
            </div>
          )}

          <div className="exercise-count">
            <strong>Exercises:</strong>
            <span>{template.exercises ? template.exercises.length : 0} exercises</span>
          </div>
        </div>

        <div className="template-actions">
          <button 
            className="btn btn-secondary btn-small"
            onClick={onViewDetails}
          >
            View Details
          </button>
          <button 
            className="btn btn-primary btn-start"
            onClick={onStartWorkout}
          >
            <Play size={16} />
            Start Workout
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutTemplateCard;