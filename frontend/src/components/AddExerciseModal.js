import React, { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import './AddExerciseModal.css';

const AddExerciseModal = ({ isOpen, onClose, onExerciseCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    muscle_groups: [],
    equipment: '',
    difficulty_level: '',
    instructions: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const categories = ['strength', 'cardio', 'flexibility', 'sports'];
  const difficulties = ['beginner', 'intermediate', 'advanced'];
  const availableMuscleGroups = [
    'chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms',
    'abs', 'obliques', 'quads', 'hamstrings', 'glutes', 'calves',
    'full body', 'core', 'upper body', 'lower body'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMuscleGroupChange = (muscleGroup) => {
    setFormData(prev => ({
      ...prev,
      muscle_groups: prev.muscle_groups.includes(muscleGroup)
        ? prev.muscle_groups.filter(mg => mg !== muscleGroup)
        : [...prev.muscle_groups, muscleGroup]
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      muscle_groups: [],
      equipment: '',
      difficulty_level: '',
      instructions: ''
    });
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Basic validation
    if (!formData.name.trim()) {
      setError('Exercise name is required');
      setIsSubmitting(false);
      return;
    }

    if (formData.name.trim().length < 2) {
      setError('Exercise name must be at least 2 characters long');
      setIsSubmitting(false);
      return;
    }

    if (!formData.category) {
      setError('Category is required');
      setIsSubmitting(false);
      return;
    }

    if (formData.muscle_groups.length === 0) {
      setError('Please select at least one muscle group');
      setIsSubmitting(false);
      return;
    }

    try {
      await onExerciseCreated(formData);
      resetForm();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create exercise');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content add-exercise-modal">
        <div className="modal-header">
          <h2>Add New Exercise</h2>
          <button 
            className="close-button"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="exercise-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Exercise Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter exercise name"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of the exercise"
              rows="3"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="difficulty_level">Difficulty Level</label>
              <select
                id="difficulty_level"
                name="difficulty_level"
                value={formData.difficulty_level}
                onChange={handleInputChange}
                disabled={isSubmitting}
              >
                <option value="">Select Difficulty</option>
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="equipment">Equipment</label>
            <input
              type="text"
              id="equipment"
              name="equipment"
              value={formData.equipment}
              onChange={handleInputChange}
              placeholder="e.g., Dumbbells, Barbell, Bodyweight"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label>Muscle Groups</label>
            <div className="muscle-groups-grid">
              {availableMuscleGroups.map(muscleGroup => (
                <label key={muscleGroup} className="muscle-group-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.muscle_groups.includes(muscleGroup)}
                    onChange={() => handleMuscleGroupChange(muscleGroup)}
                    disabled={isSubmitting}
                  />
                  <span>{muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="instructions">Instructions</label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleInputChange}
              placeholder="Step-by-step instructions for performing the exercise"
              rows="4"
              disabled={isSubmitting}
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="spinning" />
                  Creating...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Create Exercise
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExerciseModal;