import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LogIn, User, Lock } from 'lucide-react';
import './Auth.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    const result = await login(data.username, data.password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <LogIn size={40} className="auth-icon" />
          <h2>Welcome Back</h2>
          <p>Sign in to continue your fitness journey</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-group">
              <User size={20} className="input-icon" />
              <input
                type="text"
                id="username"
                {...register('username', { required: 'Username is required' })}
                placeholder="Enter your username"
              />
            </div>
            {errors.username && <div className="error-message">{errors.username.message}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-group">
              <Lock size={20} className="input-icon" />
              <input
                type="password"
                id="password"
                {...register('password', { required: 'Password is required' })}
                placeholder="Enter your password"
              />
            </div>
            {errors.password && <div className="error-message">{errors.password.message}</div>}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? 
            <Link to="/register" className="auth-link"> Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;