import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ExerciseCard from '../components/ExerciseCard';
import AddExerciseModal from '../components/AddExerciseModal';
import { Search, Filter, Plus } from 'lucide-react';
import './Pages.css';

const Exercises = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const categories = ['strength', 'cardio', 'flexibility', 'sports'];
  const difficulties = ['beginner', 'intermediate', 'advanced'];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchExercises();
  }, [user, navigate]);

  useEffect(() => {
    // Filter exercises based on search term and filters
    let filtered = exercises;

    if (searchTerm) {
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (exercise.description && exercise.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (exercise.muscle_groups && exercise.muscle_groups.some(muscle => 
          muscle.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(exercise => exercise.category === categoryFilter);
    }

    if (difficultyFilter) {
      filtered = filtered.filter(exercise => exercise.difficulty_level === difficultyFilter);
    }

    setFilteredExercises(filtered);
  }, [exercises, searchTerm, categoryFilter, difficultyFilter]);

  const fetchExercises = async () => {
    try {
      const response = await api.getExercises();
      setExercises(response.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setDifficultyFilter('');
  };

  const handleCreateExercise = async (exerciseData) => {
    try {
      await api.createExercise(exerciseData);
      await fetchExercises(); // Refresh the list
    } catch (error) {
      throw error; // Re-throw to let the modal handle the error
    }
  };

  if (loading) {
    return <div className="loading">Loading exercises...</div>;
  }

  return (
    <div className="exercises-page">
      <div className="container">
        <header className="page-header">
          <h1>Exercise Library</h1>
          <button 
            className="btn btn-primary add-exercise-btn"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={20} />
            Add Exercise
          </button>
        </header>

        <div className="search-filter-bar">
          <div className="search-box">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filters">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Difficulties</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </select>

            {(searchTerm || categoryFilter || difficultyFilter) && (
              <button onClick={clearFilters} className="btn btn-secondary">
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {filteredExercises.length > 0 ? (
          <div className="exercises-grid">
            {filteredExercises.map(exercise => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onClick={() => {
                  // Could open exercise detail modal or navigate to detail page
                  console.log('Exercise clicked:', exercise);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            {searchTerm || categoryFilter || difficultyFilter ? (
              <p>No exercises found matching your criteria</p>
            ) : (
              <p>No exercises available</p>
            )}
          </div>
        )}
      </div>

      <AddExerciseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onExerciseCreated={handleCreateExercise}
      />
    </div>
  );
};

export default Exercises;