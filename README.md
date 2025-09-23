# 🏋️‍♂️ Fitness Tracker

A full-stack fitness tracking application built with React (TypeScript) frontend and Flask backend.

## Features

- Track workouts with details like duration, calories burned, and workout type
- Add new workouts through an intuitive web interface
- View all your workouts in a clean, organized layout
- Delete workouts you no longer need
- REST API for workout management

## Project Structure

```
fitness-tracker/
├── backend/                 # Flask API server
│   ├── venv/               # Python virtual environment
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   ├── .env               # Environment variables
│   └── .gitignore         # Backend gitignore
├── frontend/              # React TypeScript application
│   ├── src/               # Source code
│   ├── public/            # Public assets
│   ├── package.json       # Node.js dependencies
│   └── ...               # Other React files
└── README.md             # This file
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the Flask server:
   ```bash
   python app.py
   ```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000`

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/workouts` - Get all workouts
- `POST /api/workouts` - Create a new workout
- `GET /api/workouts/<id>` - Get a specific workout
- `DELETE /api/workouts/<id>` - Delete a workout

## Technologies Used

### Backend
- **Flask** - Python web framework
- **Flask-CORS** - Cross-Origin Resource Sharing
- **python-dotenv** - Environment variable management

### Frontend
- **React** - User interface library
- **TypeScript** - Type-safe JavaScript
- **Axios** - HTTP client for API calls
- **CSS3** - Styling

## Development

To run both frontend and backend simultaneously:

1. Start the backend server (port 5000)
2. Start the frontend development server (port 3000)
3. The frontend will proxy API requests to the backend

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).