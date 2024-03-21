# Tour Booking API

This API serves as the backend for a tour booking system, designed specifically for tour organizers and travelers. It offers functionalities for user registration, login, tour creation, and tour booking.

## Features

1. **User Registration and Authentication:**
   - Users can register with the system by providing necessary details such as username, email, and password.
   - Authentication mechanisms ensure secure access to user-specific functionalities.

2. **Tour Creation:**
   - Organizers can create tours by providing details such as tour name, description, itinerary, pricing, and available slots.
   - Each tour is associated with an organizer, allowing for easy management and tracking.

3. **Tour Booking:**
   - Travelers can browse available tours and book slots based on their preferences and availability.
   - Booking confirmation includes essential details such as tour name, date, and organizer information.

## Technologies Used

- **Node.js**: Backend server runtime environment.
- **Express.js**: Web application framework for Node.js, simplifying API development.
- **MongoDB**: NoSQL database for storing user data, tour details, and bookings.
- **Mongoose**: MongoDB object modeling tool for Node.js, providing schema-based solutions.

## Installation and Setup

Follow these steps to set up and run the API locally:

1. Clone the repository:

    ```
    git clone <repository_url>
    ```

2. Install dependencies:

    ```
    npm install
    ```

3. Set up MongoDB:
    - Create a MongoDB Atlas account or use a local MongoDB instance.
    - Replace `<connection_string>` in `config.js` with your MongoDB connection string.

4. Start the server:

    ```
    node server.js
    ```

## API Endpoints

- **POST /api/register**
  - Register a new user.

- **POST /api/login**
  - Authenticate user credentials and generate a JWT token.

- **POST /api/tours**
  - Create a new tour.

- **GET /api/tours**
  - Retrieve all available tours.

- **GET /api/tours/:id**
  - Retrieve details of a specific tour by ID.

- **POST /api/bookings**
  - Book a slot for a tour.

- **GET /api/bookings/:id**
  - Retrieve details of a specific booking by ID.

