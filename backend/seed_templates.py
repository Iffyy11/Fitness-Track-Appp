from app import app
from database import db
from models import WorkoutTemplate, WorkoutTemplateExercise, Exercise

def seed_workout_templates():
    with app.app_context():
        # Create tables first
        db.create_all()
        
        # Check if templates already exist
        if WorkoutTemplate.query.first():
            print("Workout templates already exist, skipping...")
            return
        
        # Workout templates with free-to-use images
        templates_data = [
            {
                'name': 'Morning Energizer',
                'description': 'A quick 15-minute morning routine to kickstart your day with energy and focus.',
                'category': 'cardio',
                'difficulty_level': 'beginner',
                'estimated_duration_minutes': 15,
                'estimated_calories': 120,
                'image_url': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
                'equipment_needed': 'None',
                'target_muscle_groups': 'full body,core',
                'exercises': [
                    {'exercise_name': 'Jumping Jacks', 'order': 1, 'duration_seconds': 60, 'rest_seconds': 30},
                    {'exercise_name': 'Push-ups', 'order': 2, 'sets': 2, 'reps': 10, 'rest_seconds': 60},
                    {'exercise_name': 'Mountain Climbers', 'order': 3, 'duration_seconds': 45, 'rest_seconds': 30},
                    {'exercise_name': 'Squats', 'order': 4, 'sets': 2, 'reps': 15, 'rest_seconds': 60},
                    {'exercise_name': 'Plank', 'order': 5, 'duration_seconds': 30, 'rest_seconds': 30}
                ]
            },
            {
                'name': 'Upper Body Strength',
                'description': 'Build upper body strength with this focused 30-minute workout targeting chest, shoulders, and arms.',
                'category': 'strength',
                'difficulty_level': 'intermediate',
                'estimated_duration_minutes': 30,
                'estimated_calories': 250,
                'image_url': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
                'equipment_needed': 'Dumbbells,Bench',
                'target_muscle_groups': 'chest,shoulders,biceps,triceps',
                'exercises': [
                    {'exercise_name': 'Push-ups', 'order': 1, 'sets': 3, 'reps': 12, 'rest_seconds': 90},
                    {'exercise_name': 'Dumbbell Shoulder Press', 'order': 2, 'sets': 3, 'reps': 10, 'rest_seconds': 90},
                    {'exercise_name': 'Dumbbell Bicep Curls', 'order': 3, 'sets': 3, 'reps': 12, 'rest_seconds': 60},
                    {'exercise_name': 'Dumbbell Rows', 'order': 4, 'sets': 3, 'reps': 10, 'rest_seconds': 90},
                    {'exercise_name': 'Tricep Dips', 'order': 5, 'sets': 3, 'reps': 8, 'rest_seconds': 60}
                ]
            },
            {
                'name': 'HIIT Fat Burner',
                'description': 'High-intensity interval training to maximize calorie burn in just 20 minutes.',
                'category': 'hiit',
                'difficulty_level': 'advanced',
                'estimated_duration_minutes': 20,
                'estimated_calories': 300,
                'image_url': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
                'equipment_needed': 'None',
                'target_muscle_groups': 'full body,core',
                'exercises': [
                    {'exercise_name': 'Burpees', 'order': 1, 'duration_seconds': 45, 'rest_seconds': 15},
                    {'exercise_name': 'Mountain Climbers', 'order': 2, 'duration_seconds': 45, 'rest_seconds': 15},
                    {'exercise_name': 'Jump Squats', 'order': 3, 'duration_seconds': 45, 'rest_seconds': 15},
                    {'exercise_name': 'High Knees', 'order': 4, 'duration_seconds': 45, 'rest_seconds': 15},
                    {'exercise_name': 'Plank Jacks', 'order': 5, 'duration_seconds': 45, 'rest_seconds': 60}
                ]
            },
            {
                'name': 'Lower Body Power',
                'description': 'Strengthen and tone your legs and glutes with this comprehensive lower body workout.',
                'category': 'strength',
                'difficulty_level': 'intermediate',
                'estimated_duration_minutes': 35,
                'estimated_calories': 280,
                'image_url': 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=400&h=300&fit=crop',
                'equipment_needed': 'Dumbbells',
                'target_muscle_groups': 'quads,hamstrings,glutes,calves',
                'exercises': [
                    {'exercise_name': 'Squats', 'order': 1, 'sets': 4, 'reps': 15, 'rest_seconds': 90},
                    {'exercise_name': 'Lunges', 'order': 2, 'sets': 3, 'reps': 12, 'rest_seconds': 60},
                    {'exercise_name': 'Deadlifts', 'order': 3, 'sets': 3, 'reps': 10, 'rest_seconds': 120},
                    {'exercise_name': 'Calf Raises', 'order': 4, 'sets': 3, 'reps': 20, 'rest_seconds': 60},
                    {'exercise_name': 'Glute Bridges', 'order': 5, 'sets': 3, 'reps': 15, 'rest_seconds': 60}
                ]
            },
            {
                'name': 'Core Crusher',
                'description': 'Target your core muscles with this intense 25-minute abdominal workout.',
                'category': 'strength',
                'difficulty_level': 'intermediate',
                'estimated_duration_minutes': 25,
                'estimated_calories': 180,
                'image_url': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
                'equipment_needed': 'Exercise Mat',
                'target_muscle_groups': 'abs,obliques,core',
                'exercises': [
                    {'exercise_name': 'Plank', 'order': 1, 'duration_seconds': 60, 'rest_seconds': 30},
                    {'exercise_name': 'Russian Twists', 'order': 2, 'sets': 3, 'reps': 20, 'rest_seconds': 45},
                    {'exercise_name': 'Bicycle Crunches', 'order': 3, 'sets': 3, 'reps': 20, 'rest_seconds': 45},
                    {'exercise_name': 'Mountain Climbers', 'order': 4, 'duration_seconds': 45, 'rest_seconds': 30},
                    {'exercise_name': 'Dead Bug', 'order': 5, 'sets': 3, 'reps': 10, 'rest_seconds': 60}
                ]
            },
            {
                'name': 'Yoga Flow Basics',
                'description': 'A gentle 30-minute yoga flow perfect for beginners to improve flexibility and mindfulness.',
                'category': 'flexibility',
                'difficulty_level': 'beginner',
                'estimated_duration_minutes': 30,
                'estimated_calories': 150,
                'image_url': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop',
                'equipment_needed': 'Yoga Mat',
                'target_muscle_groups': 'full body,core',
                'exercises': [
                    {'exercise_name': 'Sun Salutation', 'order': 1, 'duration_seconds': 300, 'rest_seconds': 30},
                    {'exercise_name': 'Warrior Pose', 'order': 2, 'duration_seconds': 120, 'rest_seconds': 30},
                    {'exercise_name': 'Tree Pose', 'order': 3, 'duration_seconds': 60, 'rest_seconds': 30},
                    {'exercise_name': 'Child\'s Pose', 'order': 4, 'duration_seconds': 90, 'rest_seconds': 30},
                    {'exercise_name': 'Downward Dog', 'order': 5, 'duration_seconds': 120, 'rest_seconds': 30}
                ]
            }
        ]
        
        created_count = 0
        
        for template_data in templates_data:
            # Create the workout template
            template = WorkoutTemplate(
                name=template_data['name'],
                description=template_data['description'],
                category=template_data['category'],
                difficulty_level=template_data['difficulty_level'],
                estimated_duration_minutes=template_data['estimated_duration_minutes'],
                estimated_calories=template_data['estimated_calories'],
                image_url=template_data['image_url'],
                equipment_needed=template_data['equipment_needed'],
                target_muscle_groups=template_data['target_muscle_groups']
            )
            
            db.session.add(template)
            db.session.flush()  # Get the template ID
            
            # Add exercises to the template
            for exercise_data in template_data['exercises']:
                # Find the exercise by name
                exercise = Exercise.query.filter_by(name=exercise_data['exercise_name']).first()
                if exercise:
                    template_exercise = WorkoutTemplateExercise(
                        template_id=template.id,
                        exercise_id=exercise.id,
                        order_in_template=exercise_data['order'],
                        sets=exercise_data.get('sets'),
                        reps=exercise_data.get('reps'),
                        duration_seconds=exercise_data.get('duration_seconds'),
                        rest_seconds=exercise_data.get('rest_seconds', 60)
                    )
                    db.session.add(template_exercise)
                else:
                    print(f"Warning: Exercise '{exercise_data['exercise_name']}' not found in database")
            
            created_count += 1
        
        db.session.commit()
        print(f"Created {created_count} workout templates successfully!")

if __name__ == '__main__':
    seed_workout_templates()