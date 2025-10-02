import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Mail, Scale, Ruler, Target, Save, Calendar } from 'lucide-react';
import './Pages.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Populate form with current user data
    setValue('first_name', user.first_name);
    setValue('last_name', user.last_name);
    setValue('email', user.email);
    setValue('age', user.age);
    setValue('weight', user.weight);
    setValue('height', user.height);
    setValue('fitness_goal', user.fitness_goal);
  }, [user, navigate, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage('');

    const result = await updateUser(user.id, data);

    if (result.success) {
      setMessage('Profile updated successfully!');
      setMessageType('success');
    } else {
      setMessage(result.error);
      setMessageType('error');
    }

    setLoading(false);
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <header className="page-header">
          <h1>My Profile</h1>
        </header>

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                <User size={60} />
              </div>
              <div className="profile-info">
                <h2>{user.first_name} {user.last_name}</h2>
                <p>@{user.username}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
              {message && (
                <div className={`message ${messageType}`}>
                  {message}
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first_name">First Name</label>
                  <div className="input-group">
                    <User size={20} className="input-icon" />
                    <input
                      type="text"
                      id="first_name"
                      {...register('first_name', { required: 'First name is required' })}
                    />
                  </div>
                  {errors.first_name && <div className="error-message">{errors.first_name.message}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="last_name">Last Name</label>
                  <div className="input-group">
                    <User size={20} className="input-icon" />
                    <input
                      type="text"
                      id="last_name"
                      {...register('last_name', { required: 'Last name is required' })}
                    />
                  </div>
                  {errors.last_name && <div className="error-message">{errors.last_name.message}</div>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-group">
                  <Mail size={20} className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    readOnly
                    className="readonly"
                  />
                </div>
                {errors.email && <div className="error-message">{errors.email.message}</div>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="age">Age</label>
                  <div className="input-group">
                    <Calendar size={20} className="input-icon" />
                    <input
                      type="number"
                      id="age"
                      {...register('age', { 
                        min: { value: 1, message: 'Age must be positive' },
                        max: { value: 120, message: 'Age must be realistic' }
                      })}
                      placeholder="Enter your age"
                    />
                  </div>
                  {errors.age && <div className="error-message">{errors.age.message}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="weight">Weight (kg)</label>
                  <div className="input-group">
                    <Scale size={20} className="input-icon" />
                    <input
                      type="number"
                      step="0.1"
                      id="weight"
                      {...register('weight', { 
                        min: { value: 1, message: 'Weight must be positive' }
                      })}
                      placeholder="Enter your weight"
                    />
                  </div>
                  {errors.weight && <div className="error-message">{errors.weight.message}</div>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="height">Height (cm)</label>
                <div className="input-group">
                  <Ruler size={20} className="input-icon" />
                  <input
                    type="number"
                    step="0.1"
                    id="height"
                    {...register('height', { 
                      min: { value: 1, message: 'Height must be positive' }
                    })}
                    placeholder="Enter your height"
                  />
                </div>
                {errors.height && <div className="error-message">{errors.height.message}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="fitness_goal">Fitness Goal</label>
                <div className="input-group">
                  <Target size={20} className="input-icon" />
                  <textarea
                    id="fitness_goal"
                    {...register('fitness_goal')}
                    placeholder="Describe your fitness goals..."
                    rows="3"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary profile-submit-btn"
                disabled={loading}
              >
                <Save size={20} />
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;