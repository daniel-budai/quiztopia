# Quiztopia API

Quiztopia is a quiz application with the following API endpoints:

## Endpoints

### User Management
- `POST https://qoi1ldlo3c.execute-api.eu-north-1.amazonaws.com/signup`: Create a new user account
  ```json
  {
    "username": "testuser",
    "password": "pwd123"
  }
  ```

- `POST https://qoi1ldlo3c.execute-api.eu-north-1.amazonaws.com/login`: Authenticate a user
  ```json
  {
    "username": "testuser",
    "password": "pwd123"
  }
  ```

### Quiz Management
- `POST https://qoi1ldlo3c.execute-api.eu-north-1.amazonaws.com/quizzes`: Create a new quiz
  ```json
  {
    "title": "Platser i Stockholm"
  }
  ```

- `GET https://qoi1ldlo3c.execute-api.eu-north-1.amazonaws.com/quizzes`: Retrieve all quizzes

- `DELETE https://qoi1ldlo3c.execute-api.eu-north-1.amazonaws.com/quizzes/{quizId}`: Delete a specific quiz

### Question Management
- `POST https://qoi1ldlo3c.execute-api.eu-north-1.amazonaws.com/quizzes/{quizId}/questions`: Add a question to a specific quiz
  ```json
  {
    "question": "Vad heter gallerian?",
    "answer": "Kista galleria",
    "latitude": 73.3498,
    "longitude": 26.2603
  }
  ```

- `GET https://qoi1ldlo3c.execute-api.eu-north-1.amazonaws.com/quizzes/{quizId}/questions`: Get all questions for a specific quiz

### Leaderboard and Gameplay
- `GET https://qoi1ldlo3c.execute-api.eu-north-1.amazonaws.com/quizzes/{quizId}/leaderboard`: Get the leaderboard for a specific quiz

- `POST https://qoi1ldlo3c.execute-api.eu-north-1.amazonaws.com/quizzes/{quizId}/play`: Submit answers and add score to leaderboard
  ```json
  {
    "answers": [
      {
        "answer": "paris",
        "latitude": 7.8566,
        "longitude": 22.3522
      }
    ]
  }
  ```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
