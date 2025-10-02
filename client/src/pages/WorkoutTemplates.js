import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import WorkoutTemplateCard from '../components/WorkoutTemplateCard';
import { Search, Filter, X, Clock, Zap, Target, ChevronDown } from 'lucide-react';
import './Pages.css';

const WorkoutTemplates = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [muscleGroupFilter, setMuscleGroupFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['cardio', 'strength', 'hiit', 'flexibility', 'sports', 'full-body', 'upper-body', 'lower-body'];
  const difficulties = ['beginner', 'intermediate', 'advanced'];
  const durations = [
    { label: 'Quick (< 30 min)', value: 'quick', max: 30 },
    { label: 'Medium (30-60 min)', value: 'medium', min: 30, max: 60 },
    { label: 'Long (> 60 min)', value: 'long', min: 60 }
  ];
  const muscleGroups = ['chest', 'back', 'shoulders', 'arms', 'core', 'legs', 'glutes', 'full-body'];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchTemplates();
  }, [user, navigate]);

  useEffect(() => {
    // Filter templates based on search term and filters
    let filtered = templates;

    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (template.description && template.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (template.target_muscle_groups && template.target_muscle_groups.some(muscle => 
          muscle.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(template => template.category === categoryFilter);
    }

    if (difficultyFilter) {
      filtered = filtered.filter(template => template.difficulty_level === difficultyFilter);
    }

    if (durationFilter) {
      const duration = durations.find(d => d.value === durationFilter);
      if (duration) {
        filtered = filtered.filter(template => {
          const templateDuration = template.estimated_duration_minutes;
          if (duration.min && duration.max) {
            return templateDuration >= duration.min && templateDuration <= duration.max;
          } else if (duration.max) {
            return templateDuration < duration.max;
          } else if (duration.min) {
            return templateDuration > duration.min;
          }
          return true;
        });
      }
    }

    if (muscleGroupFilter) {
      filtered = filtered.filter(template => 
        template.target_muscle_groups && 
        template.target_muscle_groups.some(muscle => 
          muscle.toLowerCase().includes(muscleGroupFilter.toLowerCase())
        )
      );
    }

    setFilteredTemplates(filtered);
  }, [templates, searchTerm, categoryFilter, difficultyFilter, durationFilter, muscleGroupFilter]);

  const fetchTemplates = async () => {
    try {
      const response = await api.getTemplates();
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching workout templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setDifficultyFilter('');
    setDurationFilter('');
    setMuscleGroupFilter('');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (categoryFilter) count++;
    if (difficultyFilter) count++;
    if (durationFilter) count++;
    if (muscleGroupFilter) count++;
    return count;
  };

  const handleStartWorkout = async (template) => {
    try {
      const response = await api.startWorkoutFromTemplate(template.id, { user_id: user.id });
      // Navigate to workout execution page with the created workout
      navigate(`/workout-session/${response.data.workout.id}`, { 
        state: { 
          workout: response.data.workout, 
          template: response.data.template 
        }
      });
    } catch (error) {
      console.error('Error starting workout:', error);
      alert('Failed to start workout. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading workout templates...</div>;
  }

  return (
    <div className="workout-templates-page">
      <div className="container">
        <header className="page-header">
          <h1>Workout Templates</h1>
          <span className="template-count">{filteredTemplates.length} workouts available</span>
        </header>

        <div className="search-filter-section">
          <div className="search-filter-bar">
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search workouts by name, description, or muscle group..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="clear-search-btn"
                  onClick={() => setSearchTerm('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="filter-controls">
              <button 
                className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} />
                Filters
                {getActiveFiltersCount() > 0 && (
                  <span className="filter-count">{getActiveFiltersCount()}</span>
                )}
                <ChevronDown size={16} className={`chevron ${showFilters ? 'rotated' : ''}`} />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="filters-panel">
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Difficulty</label>
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
                </div>

                <div className="filter-group">
                  <label>
                    <Clock size={16} />
                    Duration
                  </label>
                  <select
                    value={durationFilter}
                    onChange={(e) => setDurationFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">Any Duration</option>
                    {durations.map(duration => (
                      <option key={duration.value} value={duration.value}>
                        {duration.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>
                    <Target size={16} />
                    Muscle Group
                  </label>
                  <select
                    value={muscleGroupFilter}
                    onChange={(e) => setMuscleGroupFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All Muscle Groups</option>
                    {muscleGroups.map(muscle => (
                      <option key={muscle} value={muscle}>
                        {muscle.charAt(0).toUpperCase() + muscle.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {(categoryFilter || difficultyFilter || durationFilter || muscleGroupFilter) && (
                <div className="filter-actions">
                  <button onClick={clearFilters} className="btn btn-secondary clear-filters-btn">
                    <X size={16} />
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {filteredTemplates.length > 0 ? (
          <div className="templates-grid">
            {filteredTemplates.map(template => (
              <WorkoutTemplateCard
                key={template.id}
                template={template}
                onStartWorkout={() => handleStartWorkout(template)}
                onViewDetails={() => navigate(`/template/${template.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            {searchTerm || getActiveFiltersCount() > 0 ? (
              <div>
                <Zap size={48} className="empty-icon" />
                <h3>No workouts found</h3>
                <p>Try adjusting your search or filter criteria</p>
                <button onClick={clearFilters} className="btn btn-primary">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div>
                <Zap size={48} className="empty-icon" />
                <h3>No workout templates available</h3>
                <p>Check back later for new workout templates</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutTemplates;