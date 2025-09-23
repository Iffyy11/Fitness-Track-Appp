from flask import Flask, request, jsonify
from flask_cors import CORS
from database import db
from datetime import datetime
import os

# Initialize Flask app
app = Flask(_name_)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///fitness_tracker.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-here'

# Initialize extensions
db.init_app(app)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Fitness Tracker API is running'})

if _name_ == '_main_':
    # Import models and routes here to avoid circular imports
    from models import User, Exercise, Workout, WorkoutExercise, WorkoutTemplate, WorkoutTemplateExercise
    from routes import auth_bp, workout_bp, exercise_bp, template_bp
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(workout_bp, url_prefix='/api/workouts')
    app.register_blueprint(exercise_bp, url_prefix='/api/exercises')
    app.register_blueprint(template_bp, url_prefix='/api/templates')
    
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)