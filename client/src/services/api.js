import axios from 'axios';

const BASE_URL = 'https://fitness-tracke-app-qthd.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth endpoints
export const authAPI = {
  login: (username, password) => 
    api.post('/auth/login', { username, password }),
  
  register: (userData) => 
    api.post('/auth/register', userData),
  
  getUser: (userId) => 
    api.get(`/auth/users/${userId}`),
  
  updateUser: (userId, userData) => 
    api.put(`/auth/users/${userId}`, userData),
};

// Workout endpoints
export const workoutAPI = {
  getWorkouts: (userId) => 
    api.get(`/workouts${userId ? `?user_id=${userId}` : ''}`),
  
  getWorkout: (workoutId) => 
    api.get(`/workouts/${workoutId}`),
  
  createWorkout: (workoutData) => 
    api.post('/workouts', workoutData),
  
  updateWorkout: (workoutId, workoutData) => 
    api.put(`/workouts/${workoutId}`, workoutData),
  
  deleteWorkout: (workoutId) => 
    api.delete(`/workouts/${workoutId}`),
};

// Exercise endpoints
export const exerciseAPI = {
  getExercises: (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    return api.get(`/exercises?${params.toString()}`);
  },
  
  getExercise: (exerciseId) => 
    api.get(`/exercises/${exerciseId}`),
  
  createExercise: (exerciseData) => 
    api.post('/exercises', exerciseData),
};

// Workout Template endpoints
export const templateAPI = {
  getTemplates: (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    return api.get(`/templates?${params.toString()}`);
  },
  
  getTemplate: (templateId) => 
    api.get(`/templates/${templateId}`),
  
  startWorkoutFromTemplate: (templateId, userData) => 
    api.post(`/templates/${templateId}/start`, userData),
};

// Combined API object
const apiService = {
  // Auth
  login: authAPI.login,
  register: authAPI.register,
  getUser: authAPI.getUser,
  updateUser: authAPI.updateUser,
  
  // Workouts
  getWorkouts: workoutAPI.getWorkouts,
  getWorkout: workoutAPI.getWorkout,
  createWorkout: workoutAPI.createWorkout,
  updateWorkout: workoutAPI.updateWorkout,
  deleteWorkout: workoutAPI.deleteWorkout,
  
  // Exercises
  getExercises: exerciseAPI.getExercises,
  getExercise: exerciseAPI.getExercise,
  createExercise: exerciseAPI.createExercise,
  
  // Workout Templates
  getTemplates: templateAPI.getTemplates,
  getTemplate: templateAPI.getTemplate,
  startWorkoutFromTemplate: templateAPI.startWorkoutFromTemplate,
  
  // Health check
  healthCheck: () => api.get('/health'),
};

export default apiService;