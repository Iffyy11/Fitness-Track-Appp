from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import User, Workout, Exercise, WorkoutExercise, WorkoutTemplate, WorkoutTemplateExercise
from database import db
from datetime import datetime, date

# Authentication routes
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Check if user already exists
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already exists'}), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400
        
        # Create new user
        user = User(
            username=data['username'],
            email=data['email'],
            password_hash=generate_password_hash(data['password']),
            first_name=data['first_name'],
            last_name=data['last_name'],
            age=data.get('age'),
            weight=data.get('weight'),
            height=data.get('height'),
            fitness_goal=data.get('fitness_goal')
        )
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({'message': 'User created successfully', 'user': user.to_dict()}), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        
        if user and check_password_hash(user.password_hash, data['password']):
            return jsonify({'message': 'Login successful', 'user': user.to_dict()}), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = User.query.get_or_404(user_id)
        return jsonify(user.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        
        # Update user fields
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.age = data.get('age', user.age)
        user.weight = data.get('weight', user.weight)
        user.height = data.get('height', user.height)
        user.fitness_goal = data.get('fitness_goal', user.fitness_goal)
        
        db.session.commit()
        return jsonify({'message': 'User updated successfully', 'user': user.to_dict()}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Workout routes
workout_bp = Blueprint('workouts', __name__)

@workout_bp.route('', methods=['GET'])
def get_workouts():
    try:
        user_id = request.args.get('user_id')
        if user_id:
            workouts = Workout.query.filter_by(user_id=user_id).order_by(Workout.date.desc()).all()
        else:
            workouts = Workout.query.order_by(Workout.date.desc()).all()
        
        return jsonify([workout.to_dict() for workout in workouts]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@workout_bp.route('/<int:workout_id>', methods=['GET'])
def get_workout(workout_id):
    try:
        workout = Workout.query.get_or_404(workout_id)
        return jsonify(workout.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@workout_bp.route('', methods=['POST'])
def create_workout():
    try:
        data = request.get_json()
        
        workout = Workout(
            user_id=data['user_id'],
            name=data['name'],
            description=data.get('description'),
            date=datetime.strptime(data['date'], '%Y-%m-%d').date() if data.get('date') else date.today(),
            duration_minutes=data.get('duration_minutes'),
            calories_burned=data.get('calories_burned'),
            notes=data.get('notes')
        )
        
        db.session.add(workout)
        db.session.flush()  # Get the workout ID
        
        # Add exercises to workout
        if 'exercises' in data:
            for i, exercise_data in enumerate(data['exercises']):
                workout_exercise = WorkoutExercise(
                    workout_id=workout.id,
                    exercise_id=exercise_data['exercise_id'],
                    sets=exercise_data.get('sets'),
                    reps=exercise_data.get('reps'),
                    weight=exercise_data.get('weight'),
                    duration_seconds=exercise_data.get('duration_seconds'),
                    distance=exercise_data.get('distance'),
                    calories_burned=exercise_data.get('calories_burned'),
                    notes=exercise_data.get('notes'),
                    order_in_workout=i + 1
                )
                db.session.add(workout_exercise)
        
        db.session.commit()
        return jsonify({'message': 'Workout created successfully', 'workout': workout.to_dict()}), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@workout_bp.route('/<int:workout_id>', methods=['PUT'])
def update_workout(workout_id):
    try:
        workout = Workout.query.get_or_404(workout_id)
        data = request.get_json()
        
        workout.name = data.get('name', workout.name)
        workout.description = data.get('description', workout.description)
        workout.duration_minutes = data.get('duration_minutes', workout.duration_minutes)
        workout.calories_burned = data.get('calories_burned', workout.calories_burned)
        workout.notes = data.get('notes', workout.notes)
        
        if data.get('date'):
            workout.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        
        db.session.commit()
        return jsonify({'message': 'Workout updated successfully', 'workout': workout.to_dict()}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@workout_bp.route('/<int:workout_id>', methods=['DELETE'])
def delete_workout(workout_id):
    try:
        workout = Workout.query.get_or_404(workout_id)
        db.session.delete(workout)
        db.session.commit()
        return jsonify({'message': 'Workout deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Exercise routes
exercise_bp = Blueprint('exercises', __name__)

@exercise_bp.route('', methods=['GET'])
def get_exercises():
    try:
        category = request.args.get('category')
        muscle_group = request.args.get('muscle_group')
        difficulty = request.args.get('difficulty')
        
        query = Exercise.query
        
        if category:
            query = query.filter(Exercise.category == category)
        if muscle_group:
            query = query.filter(Exercise.muscle_groups.contains(muscle_group))
        if difficulty:
            query = query.filter(Exercise.difficulty_level == difficulty)
        
        exercises = query.all()
        return jsonify([exercise.to_dict() for exercise in exercises]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@exercise_bp.route('/<int:exercise_id>', methods=['GET'])
def get_exercise(exercise_id):
    try:
        exercise = Exercise.query.get_or_404(exercise_id)
        return jsonify(exercise.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@exercise_bp.route('', methods=['POST'])
def create_exercise():
    try:
        data = request.get_json()
        
        exercise = Exercise(
            name=data['name'],
            description=data.get('description'),
            category=data['category'],
            muscle_groups=','.join(data.get('muscle_groups', [])),
            equipment=data.get('equipment'),
            difficulty_level=data.get('difficulty_level'),
            instructions=data.get('instructions')
        )
        
        db.session.add(exercise)
        db.session.commit()
        
        return jsonify({'message': 'Exercise created successfully', 'exercise': exercise.to_dict()}), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Workout Template routes
template_bp = Blueprint('templates', __name__)

@template_bp.route('', methods=['GET'])
def get_workout_templates():
    try:
        category = request.args.get('category')
        difficulty = request.args.get('difficulty')
        
        query = WorkoutTemplate.query
        
        if category:
            query = query.filter(WorkoutTemplate.category == category)
        if difficulty:
            query = query.filter(WorkoutTemplate.difficulty_level == difficulty)
        
        templates = query.all()
        return jsonify([template.to_dict() for template in templates]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@template_bp.route('/<int:template_id>', methods=['GET'])
def get_workout_template(template_id):
    try:
        template = WorkoutTemplate.query.get_or_404(template_id)
        return jsonify(template.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@template_bp.route('/<int:template_id>/start', methods=['POST'])
def start_workout_from_template(template_id):
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400
        
        template = WorkoutTemplate.query.get_or_404(template_id)
        
        # Create a new workout based on the template
        workout = Workout(
            user_id=user_id,
            name=template.name,
            description=template.description,
            date=datetime.utcnow().date()
        )
        
        db.session.add(workout)
        db.session.flush()  # Get the workout ID
        
        # Add exercises from template to workout
        for template_exercise in template.template_exercises:
            workout_exercise = WorkoutExercise(
                workout_id=workout.id,
                exercise_id=template_exercise.exercise_id,
                sets=template_exercise.sets,
                reps=template_exercise.reps,
                duration_seconds=template_exercise.duration_seconds,
                order_in_workout=template_exercise.order_in_template
            )
            db.session.add(workout_exercise)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Workout started successfully',
            'workout': workout.to_dict(),
            'template': template.to_dict()
        }), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500