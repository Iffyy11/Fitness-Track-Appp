from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

# Configure CORS
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///fitness_tracker.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-here'

# Initialize database
from database import db
db.init_app(app)

# Import routes after app context is set
try:
    from routes import auth_bp, workout_bp, exercise_bp, template_bp

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(workout_bp, url_prefix='/api/workouts')
    app.register_blueprint(exercise_bp, url_prefix='/api/exercises')
    app.register_blueprint(template_bp, url_prefix='/api/templates')

    # Import models to ensure they are registered with SQLAlchemy
    from models import *

    # Create database tables first
    with app.app_context():
        db.create_all()

except ImportError:
    print("⚠️  Routes not found, continuing with basic setup")

@app.route('/')
def home():
    return jsonify({
        'message': 'Fitness Tracker API is running!',
        'version': '1.0.0',
        'status': 'healthy'
    })

@app.route('/api/health')
def health_check():
    return jsonify({'status': 'healthy', 'service': 'fitness-tracker-api'})

if __name__ == '__main__':
    print("🚀 Starting Fitness Tracker Backend...")
    print("📍 Server running at: http://localhost:5000")
    print("🔗 API Health: http://localhost:5000/api/health")
    app.run(debug=True, host='0.0.0.0', port=5000)
