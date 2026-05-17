# SmartStay - Rental house booking system

A full-stack web application demonstrating user authentication, sessions, and property management using Node.js, Express, and MongoDB.
This project showcases secure login/logout functionality, session persistence, and a host dashboard for managing property listings.

## Features

- **User Authentication** – Secure login and logout with password protection
- **Session Management** – MongoDB-backed session storage for persistent authentication
- **Protected Routes** – Host-only routes secured with session middleware
- **Property Management** – Add, edit, and delete property listings
- **Responsive Design** – Modern UI with Bootstrap 5 and Tailwind CSS
- **User Dashboard** – Personalized interface for hosts and users

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shubhambatwal03/SmartStay.git
   cd Airbnb-Clone

2. Install dependencies:
   ```
   npm install

3. Update MongoDB Connection:
    Open app.js and replace the DB_PATH with your MongoDB Atlas connection string

4. Start the development server:
  ```
  npm start
  ```
5. Open http://localhost:1101 to view it in your browser.

## Folder Structure

  ```
  ├── app.js                    # Main application entry point
  ├── controller/               # Business logic handlers
  │   ├── authController.js    # Login/logout logic
  │   ├── hostController.js    # Property management
  │   └── homeController.js    # General controllers
  ├── routes/                  # API route definitions
  │   ├── authRouter.js        # Auth routes
  │   ├── hostRouter.js        # Host property routes
  │   └── userRouter.js        # User routes
  ├── models/                  # MongoDB schemas
  ├── views/                   # EJS template files
  ├── public/                  # Static assets (CSS, images)
  └── utils/                   # Utility functions
  ```

## Tech Stack

  **Frontend**: EJS, Bootstrap 5, Tailwind CSS
  **Backend**: Node.js, Express.js, Nodemon
  **Database**: MongoDB, Mongoose
  **Session Management**: express-session, connect-mongodb-session


## Screenshots

## License
