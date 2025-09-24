
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Activity, Dumbbell, LogOut, Home, PlayCircle } from 'lucide-react';
import './NavBar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Activity className="brand-icon" />
          <span>Fitness Tracker</span>
        </Link>

        {user ? (
          <div className="navbar-menu">
            <Link to="/" className="navbar-item">
              <Home size={18} />
              <span>Dashboard</span>
            </Link>
            <Link to="/workouts" className="navbar-item">
              <Dumbbell size={18} />
              <span>Workouts</span>
            </Link>
            <Link to="/templates" className="navbar-item">
              <PlayCircle size={18} />
              <span>Templates</span>
            </Link>
            <Link to="/exercises" className="navbar-item">
              <Activity size={18} />
              <span>Exercises</span>
            </Link>
            <Link to="/profile" className="navbar-item">
              <User size={18} />
              <span>Profile</span>
            </Link>
            <button onClick={handleLogout} className="navbar-item logout-btn">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="navbar-menu">
            <Link to="/login" className="navbar-item">
              <span>Login</span>
            </Link>
            <Link to="/register" className="navbar-item">
              <span>Register</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;