from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Sample data for fitness tracking
workouts = [
    {
        'id': 1,
        'name': 'Morning Run',
        'type': 'cardio',
        'duration': 30,
        'calories': 300,
        'date': '2025-09-23'
    },
    {
        'id': 2,
        'name': 'Weight Training',
        'type': 'strength',
        'duration': 45,
        'calories': 200,
        'date': '2025-09-23'
    }
]

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Fitness Tracker API is running'})

@app.route('/api/workouts', methods=['GET'])
def get_workouts():
    """Get all workouts"""
    return jsonify({'workouts': workouts})

@app.route('/api/workouts', methods=['POST'])
def create_workout():
    """Create a new workout"""
    data = request.get_json()
    
    if not data or 'name' not in data:
        return jsonify({'error': 'Name is required'}), 400
    
    new_workout = {
        'id': len(workouts) + 1,
        'name': data['name'],
        'type': data.get('type', 'general'),
        'duration': data.get('duration', 0),
        'calories': data.get('calories', 0),
        'date': data.get('date', '2025-09-23')
    }
    
    workouts.append(new_workout)
    return jsonify({'workout': new_workout}), 201

@app.route('/api/workouts/<int:workout_id>', methods=['GET'])
def get_workout(workout_id):
    """Get a specific workout by ID"""
    workout = next((w for w in workouts if w['id'] == workout_id), None)
    
    if not workout:
        return jsonify({'error': 'Workout not found'}), 404
    
    return jsonify({'workout': workout})

@app.route('/api/workouts/<int:workout_id>', methods=['DELETE'])
def delete_workout(workout_id):
    """Delete a workout by ID"""
    global workouts
    workouts = [w for w in workouts if w['id'] != workout_id]
    return jsonify({'message': 'Workout deleted successfully'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)