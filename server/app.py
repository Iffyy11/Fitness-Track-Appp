from flask import Flask, jsonify
from flask_cors import CORS
import os

# Import your database instance
from database import db

app = Flask(__name__)

# Configure CORS (allow requests from your frontend only)
CORS(app, resources={r"/api/*": {"origins": "https://fitness-tracke-app-1-2sbj.onrender.com"}})

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///fitness_tracker.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-here'

# Initialize database
db.init_app(app)

# Import routes after app context is set
try:
    from routes import auth_bp, workout_bp, exercise_bp, template_bp
    from models import User, Workout, Exercise, WorkoutTemplate  # explicit imports ✅

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(workout_bp, url_prefix='/api/workouts')
    app.register_blueprint(exercise_bp, url_prefix='/api/exercises')
    app.register_blueprint(template_bp, url_prefix='/api/templates')

    # Create database tables
    with app.app_context():
        db.create_all()

except ImportError as e:
    print(f"⚠️  Failed to import routes: {e}")
    raise

# Health check route
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
    app.run(debug=False, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
