# Hotel Booking API

## Overview
The Hotel Booking API is a RESTful API designed to facilitate hotel booking operations. It allows users to manage bookings, rooms, and user accounts efficiently. This API is built using TypeScript and Express, providing a robust and scalable solution for hotel management.

## Features
- User registration and authentication
- Room management (create, update, delete, retrieve)
- Booking management (create, update, delete, retrieve)
- Comprehensive error handling
- Environment configuration using `.env` file

## Project Structure
```
hotel-booking-api
├── src
│   ├── controllers        # Contains controllers for handling requests
│   ├── models             # Contains data models for bookings, rooms, and users
│   ├── routes             # Defines API routes
│   ├── services           # Contains business logic for the application
│   ├── utils              # Utility functions
│   ├── app.ts             # Entry point of the application
│   └── config             # Configuration files (e.g., database connection)
├── package.json           # NPM dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── .env                   # Environment variables
└── README.md              # Project documentation
```

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/hotel-booking-api.git
   ```
2. Navigate to the project directory:
   ```
   cd hotel-booking-api
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory and configure your environment variables.

## Usage
To start the server, run:
```
npm start
```
The API will be available at `http://localhost:3000`.

## API Endpoints
- **User Endpoints**
  - `POST /api/users/register` - Register a new user
  - `POST /api/users/login` - Login an existing user
  - `GET /api/users/:id` - Retrieve user details
  - `PUT /api/users/:id` - Update user information

- **Room Endpoints**
  - `POST /api/rooms` - Create a new room
  - `GET /api/rooms/:id` - Retrieve room details
  - `PUT /api/rooms/:id` - Update room information
  - `DELETE /api/rooms/:id` - Delete a room

- **Booking Endpoints**
  - `POST /api/bookings` - Create a new booking
  - `GET /api/bookings/:id` - Retrieve booking details
  - `PUT /api/bookings/:id` - Update booking information
  - `DELETE /api/bookings/:id` - Cancel a booking

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.