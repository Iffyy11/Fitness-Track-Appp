from database import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    age = db.Column(db.Integer)
    weight = db.Column(db.Float)
    height = db.Column(db.Float)
    fitness_goal = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    workouts = db.relationship('Workout', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'age': self.age,
            'weight': self.weight,
            'height': self.height,
            'fitness_goal': self.fitness_goal,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Exercise(db.Model):
    __tablename__ = 'exercises'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50), nullable=False)  # strength, cardio, flexibility, etc.
    muscle_groups = db.Column(db.String(200))  # comma-separated list
    equipment = db.Column(db.String(100))
    difficulty_level = db.Column(db.String(20))  # beginner, intermediate, advanced
    instructions = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    workout_exercises = db.relationship('WorkoutExercise', backref='exercise', lazy=True)
    template_exercises = db.relationship('WorkoutTemplateExercise', backref='exercise', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'muscle_groups': self.muscle_groups.split(',') if self.muscle_groups else [],
            'equipment': self.equipment,
            'difficulty_level': self.difficulty_level,
            'instructions': self.instructions,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Workout(db.Model):
    __tablename__ = 'workouts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    duration_minutes = db.Column(db.Integer)  # total workout duration
    calories_burned = db.Column(db.Integer)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    workout_exercises = db.relationship('WorkoutExercise', backref='workout', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'description': self.description,
            'date': self.date.isoformat() if self.date else None,
            'duration_minutes': self.duration_minutes,
            'calories_burned': self.calories_burned,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'exercises': [we.to_dict() for we in self.workout_exercises]
        }

class WorkoutExercise(db.Model):
    __tablename__ = 'workout_exercises'
    
    id = db.Column(db.Integer, primary_key=True)
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.id'), nullable=False)
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercises.id'), nullable=False)
    sets = db.Column(db.Integer)
    reps = db.Column(db.Integer)
    weight = db.Column(db.Float)  # weight used in kg
    duration_seconds = db.Column(db.Integer)  # for cardio exercises
    distance = db.Column(db.Float)  # for running/cycling in km
    calories_burned = db.Column(db.Integer)
    notes = db.Column(db.Text)
    order_in_workout = db.Column(db.Integer, default=1)
    
    def to_dict(self):
        return {
            'id': self.id,
            'workout_id': self.workout_id,
            'exercise_id': self.exercise_id,
            'exercise_name': self.exercise.name if self.exercise else None,
            'sets': self.sets,
            'reps': self.reps,
            'weight': self.weight,
            'duration_seconds': self.duration_seconds,
            'distance': self.distance,
            'calories_burned': self.calories_burned,
            'notes': self.notes,
            'order_in_workout': self.order_in_workout
        }

class WorkoutTemplate(db.Model):
    __tablename__ = 'workout_templates'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50), nullable=False)  # strength, cardio, hiit, yoga, etc.
    difficulty_level = db.Column(db.String(20), nullable=False)  # beginner, intermediate, advanced
    estimated_duration_minutes = db.Column(db.Integer, nullable=False)
    estimated_calories = db.Column(db.Integer)
    image_url = db.Column(db.String(500))  # URL to workout image
    equipment_needed = db.Column(db.String(200))  # comma-separated list
    target_muscle_groups = db.Column(db.String(200))  # comma-separated list
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    template_exercises = db.relationship('WorkoutTemplateExercise', backref='template', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'difficulty_level': self.difficulty_level,
            'estimated_duration_minutes': self.estimated_duration_minutes,
            'estimated_calories': self.estimated_calories,
            'image_url': self.image_url,
            'equipment_needed': self.equipment_needed.split(',') if self.equipment_needed else [],
            'target_muscle_groups': self.target_muscle_groups.split(',') if self.target_muscle_groups else [],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'exercises': [te.to_dict() for te in self.template_exercises]
        }

class WorkoutTemplateExercise(db.Model):
    __tablename__ = 'workout_template_exercises'
    
    id = db.Column(db.Integer, primary_key=True)
    template_id = db.Column(db.Integer, db.ForeignKey('workout_templates.id'), nullable=False)
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercises.id'), nullable=False)
    order_in_template = db.Column(db.Integer, nullable=False, default=1)
    sets = db.Column(db.Integer)
    reps = db.Column(db.Integer)
    duration_seconds = db.Column(db.Integer)  # for timed exercises
    rest_seconds = db.Column(db.Integer, default=60)  # rest time after this exercise
    notes = db.Column(db.String(200))  # special instructions for this exercise in template
    
    def to_dict(self):
        return {
            'id': self.id,
            'template_id': self.template_id,
            'exercise_id': self.exercise_id,
            'exercise_name': self.exercise.name if self.exercise else None,
            'exercise_description': self.exercise.description if self.exercise else None,
            'exercise_instructions': self.exercise.instructions if self.exercise else None,
            'order_in_template': self.order_in_template,
            'sets': self.sets,
            'reps': self.reps,
            'duration_seconds': self.duration_seconds,
            'rest_seconds': self.rest_seconds,
            'notes': self.notes
        }