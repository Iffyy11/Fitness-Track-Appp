from app import app
from database import db
from models import User, Exercise, Workout, WorkoutExercise
from werkzeug.security import generate_password_hash
from datetime import date

def seed_database():
    """Seed the database with sample data"""
    
    # Create sample exercises
    exercises = [
        # Bodyweight Strength Exercises
        {
            'name': 'Push-ups',
            'description': 'A bodyweight exercise for upper body strength',
            'category': 'strength',
            'muscle_groups': 'chest,shoulders,triceps',
            'equipment': 'none',
            'difficulty_level': 'beginner',
            'instructions': '1. Start in plank position\n2. Lower body until chest nearly touches floor\n3. Push back up to starting position'
        },
        {
            'name': 'Squats',
            'description': 'A compound exercise for lower body strength',
            'category': 'strength',
            'muscle_groups': 'quadriceps,glutes,hamstrings',
            'equipment': 'none',
            'difficulty_level': 'beginner',
            'instructions': '1. Stand with feet shoulder-width apart\n2. Lower body as if sitting back into a chair\n3. Return to standing position'
        },
        {
            'name': 'Plank',
            'description': 'Core strengthening exercise',
            'category': 'strength',
            'muscle_groups': 'core,shoulders',
            'equipment': 'none',
            'difficulty_level': 'beginner',
            'instructions': '1. Start in push-up position\n2. Hold position with straight body\n3. Keep core engaged'
        },
        {
            'name': 'Pull-ups',
            'description': 'Upper body pulling exercise',
            'category': 'strength',
            'muscle_groups': 'back,biceps,forearms',
            'equipment': 'pull-up bar',
            'difficulty_level': 'intermediate',
            'instructions': '1. Hang from bar with overhand grip\n2. Pull body up until chin clears bar\n3. Lower with control'
        },
        {
            'name': 'Lunges',
            'description': 'Single-leg strengthening exercise',
            'category': 'strength',
            'muscle_groups': 'quadriceps,glutes,hamstrings',
            'equipment': 'none',
            'difficulty_level': 'beginner',
            'instructions': '1. Step forward into lunge position\n2. Lower back knee toward ground\n3. Push back to starting position'
        },
        {
            'name': 'Mountain Climbers',
            'description': 'Dynamic core and cardio exercise',
            'category': 'cardio',
            'muscle_groups': 'core,shoulders,legs',
            'equipment': 'none',
            'difficulty_level': 'intermediate',
            'instructions': '1. Start in plank position\n2. Alternate bringing knees to chest rapidly\n3. Maintain plank form throughout'
        },
        {
            'name': 'Burpees',
            'description': 'Full-body high-intensity exercise',
            'category': 'cardio',
            'muscle_groups': 'full body',
            'equipment': 'none',
            'difficulty_level': 'advanced',
            'instructions': '1. Start standing\n2. Drop to squat, kick back to plank\n3. Do push-up, jump feet back, jump up'
        },
        {
            'name': 'Jumping Jacks',
            'description': 'Classic cardio warm-up exercise',
            'category': 'cardio',
            'muscle_groups': 'full body',
            'equipment': 'none',
            'difficulty_level': 'beginner',
            'instructions': '1. Start with feet together, arms at sides\n2. Jump feet apart while raising arms overhead\n3. Jump back to starting position'
        },
        {
            'name': 'Dips',
            'description': 'Triceps and chest strengthening exercise',
            'category': 'strength',
            'muscle_groups': 'triceps,chest,shoulders',
            'equipment': 'dip bars or chair',
            'difficulty_level': 'intermediate',
            'instructions': '1. Support body weight on dip bars\n2. Lower body by bending elbows\n3. Push back up to starting position'
        },
        {
            'name': 'High Knees',
            'description': 'Running in place with high knee lift',
            'category': 'cardio',
            'muscle_groups': 'legs,core',
            'equipment': 'none',
            'difficulty_level': 'beginner',
            'instructions': '1. Stand in place\n2. Run lifting knees to waist level\n3. Pump arms naturally'
        },
        
        # Weight Training Exercises
        {
            'name': 'Bench Press',
            'description': 'Upper body pressing exercise with barbell',
            'category': 'strength',
            'muscle_groups': 'chest,shoulders,triceps',
            'equipment': 'barbell,bench',
            'difficulty_level': 'intermediate',
            'instructions': '1. Lie on bench with feet on floor\n2. Lower bar to chest with control\n3. Press bar back to starting position'
        },
        {
            'name': 'Deadlifts',
            'description': 'Full body compound lifting exercise',
            'category': 'strength',
            'muscle_groups': 'hamstrings,glutes,back,traps',
            'equipment': 'barbell',
            'difficulty_level': 'advanced',
            'instructions': '1. Stand with feet hip-width apart\n2. Hinge at hips and grip bar\n3. Stand up straight lifting bar'
        },
        {
            'name': 'Bicep Curls',
            'description': 'Isolated bicep strengthening exercise',
            'category': 'strength',
            'muscle_groups': 'biceps',
            'equipment': 'dumbbells',
            'difficulty_level': 'beginner',
            'instructions': '1. Hold dumbbells at sides\n2. Curl weights toward shoulders\n3. Lower with control'
        },
        {
            'name': 'Shoulder Press',
            'description': 'Overhead pressing exercise for shoulders',
            'category': 'strength',
            'muscle_groups': 'shoulders,triceps',
            'equipment': 'dumbbells',
            'difficulty_level': 'intermediate',
            'instructions': '1. Hold dumbbells at shoulder height\n2. Press weights overhead\n3. Lower back to shoulders'
        },
        {
            'name': 'Rows',
            'description': 'Pulling exercise for back muscles',
            'category': 'strength',
            'muscle_groups': 'back,biceps',
            'equipment': 'dumbbells',
            'difficulty_level': 'intermediate',
            'instructions': '1. Bend over with weight in hand\n2. Pull weight to lower chest\n3. Lower with control'
        },
        {
            'name': 'Leg Press',
            'description': 'Machine-based leg strengthening exercise',
            'category': 'strength',
            'muscle_groups': 'quadriceps,glutes,hamstrings',
            'equipment': 'leg press machine',
            'difficulty_level': 'beginner',
            'instructions': '1. Sit in machine with feet on platform\n2. Lower weight by bending knees\n3. Press back to starting position'
        },
        
        # Cardio Exercises
        {
            'name': 'Running',
            'description': 'Cardiovascular exercise for endurance',
            'category': 'cardio',
            'muscle_groups': 'legs,core',
            'equipment': 'none',
            'difficulty_level': 'intermediate',
            'instructions': '1. Start with a warm-up walk\n2. Maintain steady pace\n3. Cool down with walking'
        },
        {
            'name': 'Cycling',
            'description': 'Low-impact cardio exercise',
            'category': 'cardio',
            'muscle_groups': 'legs,glutes',
            'equipment': 'bicycle or stationary bike',
            'difficulty_level': 'beginner',
            'instructions': '1. Adjust seat height properly\n2. Start with easy pace\n3. Gradually increase intensity'
        },
        {
            'name': 'Jump Rope',
            'description': 'High-intensity cardio with coordination',
            'category': 'cardio',
            'muscle_groups': 'legs,shoulders,core',
            'equipment': 'jump rope',
            'difficulty_level': 'intermediate',
            'instructions': '1. Hold rope handles at sides\n2. Jump with both feet together\n3. Maintain steady rhythm'
        },
        {
            'name': 'Rowing',
            'description': 'Full-body cardio exercise',
            'category': 'cardio',
            'muscle_groups': 'back,legs,core,arms',
            'equipment': 'rowing machine',
            'difficulty_level': 'intermediate',
            'instructions': '1. Sit with good posture\n2. Drive with legs first\n3. Pull handle to lower chest'
        },
        
        # Flexibility & Mobility
        {
            'name': 'Cat-Cow Stretch',
            'description': 'Spinal mobility exercise',
            'category': 'flexibility',
            'muscle_groups': 'spine,core',
            'equipment': 'none',
            'difficulty_level': 'beginner',
            'instructions': '1. Start on hands and knees\n2. Arch back looking up (cow)\n3. Round back looking down (cat)'
        },
        {
            'name': 'Downward Dog',
            'description': 'Full body stretch from yoga',
            'category': 'flexibility',
            'muscle_groups': 'hamstrings,calves,shoulders',
            'equipment': 'none',
            'difficulty_level': 'beginner',
            'instructions': '1. Start on hands and knees\n2. Tuck toes and lift hips up\n3. Straighten legs and arms'
        },
        {
            'name': 'Child\'s Pose',
            'description': 'Relaxing stretch for back and hips',
            'category': 'flexibility',
            'muscle_groups': 'back,hips',
            'equipment': 'none',
            'difficulty_level': 'beginner',
            'instructions': '1. Kneel on floor\n2. Sit back on heels\n3. Reach arms forward and rest head down'
        },
        {
            'name': 'Pigeon Pose',
            'description': 'Deep hip opening stretch',
            'category': 'flexibility',
            'muscle_groups': 'hips,glutes',
            'equipment': 'none',
            'difficulty_level': 'intermediate',
            'instructions': '1. Start in downward dog\n2. Bring one knee forward\n3. Extend back leg straight'
        },
        
        # Core Exercises
        {
            'name': 'Crunches',
            'description': 'Basic abdominal strengthening exercise',
            'category': 'strength',
            'muscle_groups': 'abs',
            'equipment': 'none',
            'difficulty_level': 'beginner',
            'instructions': '1. Lie on back with knees bent\n2. Lift shoulders off ground\n3. Lower back down with control'
        },
        {
            'name': 'Russian Twists',
            'description': 'Rotational core exercise',
            'category': 'strength',
            'muscle_groups': 'abs,obliques',
            'equipment': 'none',
            'difficulty_level': 'intermediate',
            'instructions': '1. Sit with knees bent, lean back slightly\n2. Rotate torso left and right\n3. Keep feet off ground for added difficulty'
        },
        {
            'name': 'Dead Bug',
            'description': 'Core stability exercise',
            'category': 'strength',
            'muscle_groups': 'core',
            'equipment': 'none',
            'difficulty_level': 'beginner',
            'instructions': '1. Lie on back with arms up and knees bent\n2. Lower opposite arm and leg\n3. Return to starting position'
        },
        {
            'name': 'Leg Raises',
            'description': 'Lower abdominal strengthening exercise',
            'category': 'strength',
            'muscle_groups': 'lower abs',
            'equipment': 'none',
            'difficulty_level': 'intermediate',
            'instructions': '1. Lie on back with legs straight\n2. Lift legs to 90 degrees\n3. Lower legs without touching ground'
        },
        
        # Functional Training
        {
            'name': 'Turkish Get-Up',
            'description': 'Complex functional movement pattern',
            'category': 'strength',
            'muscle_groups': 'full body',
            'equipment': 'kettlebell',
            'difficulty_level': 'advanced',
            'instructions': '1. Lie with weight in one hand\n2. Slowly stand up keeping weight overhead\n3. Reverse the movement to return'
        },
        {
            'name': 'Farmer\'s Walk',
            'description': 'Grip and core strengthening exercise',
            'category': 'strength',
            'muscle_groups': 'grip,core,traps',
            'equipment': 'dumbbells or kettlebells',
            'difficulty_level': 'intermediate',
            'instructions': '1. Hold heavy weights at sides\n2. Walk forward with good posture\n3. Maintain tight core throughout'
        },
        {
            'name': 'Box Jumps',
            'description': 'Plyometric jumping exercise',
            'category': 'cardio',
            'muscle_groups': 'legs,glutes',
            'equipment': 'plyometric box',
            'difficulty_level': 'intermediate',
            'instructions': '1. Stand in front of box\n2. Jump up onto box landing softly\n3. Step or jump down carefully'
        }
    ]
    
    # Create sample user
    user = User(
        username='demo_user',
        email='demo@example.com',
        password_hash=generate_password_hash('password123'),
        first_name='Demo',
        last_name='User',
        age=25,
        weight=70.0,
        height=175.0,
        fitness_goal='Build muscle and improve endurance'
    )
    
    # Clear existing data
    db.drop_all()
    db.create_all()
    
    # Add user
    db.session.add(user)
    db.session.commit()
    
    # Add exercises
    for exercise_data in exercises:
        exercise = Exercise(**exercise_data)
        db.session.add(exercise)
    
    db.session.commit()
    
    # Create sample workout
    workout = Workout(
        user_id=user.id,
        name='Upper Body Strength',
        description='Focus on chest, shoulders, and arms',
        date=date.today(),
        duration_minutes=45,
        calories_burned=250,
        notes='Great workout! Felt strong today.'
    )
    
    db.session.add(workout)
    db.session.commit()
    
    # Add exercises to workout
    workout_exercises = [
        WorkoutExercise(
            workout_id=workout.id,
            exercise_id=1,  # Push-ups
            sets=3,
            reps=15,
            order_in_workout=1
        ),
        WorkoutExercise(
            workout_id=workout.id,
            exercise_id=4,  # Plank
            sets=3,
            duration_seconds=60,
            order_in_workout=2
        )
    ]
    
    for we in workout_exercises:
        db.session.add(we)
    
    db.session.commit()
    
    print("Database seeded successfully!")
    print(f"Created user: {user.username}")
    print(f"Created {len(exercises)} exercises")
    print(f"Created sample workout: {workout.name}")

if __name__ == '__main__':
    with app.app_context():
        seed_database()