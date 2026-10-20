# 🏡 SmartStay – Smart Accommodation Booking Platform

## 📌 Overview

**SmartStay** is a full-stack accommodation booking platform inspired by Airbnb. The application enables users to browse properties, view details, make bookings, manage favorites, and complete secure online payments. Hosts can add and manage property listings, while administrators can monitor platform activities.

The platform also supports **Google Authentication**, allowing users to quickly sign up or log in using their Google account.

Built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**, SmartStay provides a modern, responsive, secure, and scalable booking experience.

---

## ✨ Features

### 👤 User Features

- User Registration & Authentication
- Email & Password Login
- Sign Up with Google
- Login with Google
- Secure Authentication System
- Browse Available Properties
- Property Search & Exploration
- View Detailed Property Information
- Add Properties to Favorites
- Book Accommodations
- View Booking History
- Responsive User Interface

### 🔐 Google Authentication

- Google Sign Up Integration
- Google Login Integration
- Google Identity Verification
- Automatic User Account Creation
- Secure Google Account Authentication
- Seamless Login Experience

### 🏠 Host Features

- Add New Property Listings
- Upload Property Images
- Manage Existing Listings
- View Hosted Properties

### 💳 Payment Features

- Razorpay Payment Gateway Integration
- Secure Online Transactions
- Booking Confirmation After Payment

### ☁️ Cloud Features

- Cloudinary Image Storage
- Image Upload & Optimization

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- Axios
- React Router DOM
- Tailwind CSS
- CSS3
- Google Identity Services

### Backend

- Node.js
- Express.js
- JWT Authentication
- bcrypt.js
- Google Authentication

### Database

- MongoDB
- Mongoose

### Third-Party Services

- Google OAuth / Google Identity Services
- Razorpay
- Cloudinary

---

## 📂 Project Structure

```bash
SmartStay/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── src/
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controller/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── app.js
│
└── README.md
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/shubhambatwal01/SmartStay.git
cd SmartStay
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=1101

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

If your frontend uses the Google Client ID directly, create a `.env` file inside the frontend folder:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 🔐 Google Authentication Setup

To use Google Sign Up and Login:

1. Open the **Google Cloud Console**
2. Create or select a project
3. Configure the **OAuth Consent Screen**
4. Create an **OAuth 2.0 Client ID**
5. Add your frontend URLs to **Authorized JavaScript Origins**

For local development:

```text
http://localhost:5173
```

For production:

```text
https://your-deployed-frontend-url.com
```

Add the generated Google Client ID to your environment variables.

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

The backend verifies the Google authentication data and creates or authenticates the corresponding SmartStay user account.

---

## 📸 Screenshots

### Home Page

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/2c47f89d-94ac-4eef-b60f-97264d636d7b" />

### Google Authentication

Add a screenshot of your Google Login / Sign Up page here.

```html
<img
  width="1920"
  alt="SmartStay Google Authentication"
  src="YOUR_GOOGLE_AUTH_SCREENSHOT_URL"
/>
```

---

## 🔒 Authentication & Security

- JWT-Based Authentication
- Email & Password Authentication
- Google Authentication
- Google Identity Verification
- Password Hashing using bcrypt
- Protected Routes
- Secure User Sessions
- Secure Payment Processing
- Environment Variable Protection
- Authorized Google Origins
- Authentication Middleware

---

## 🔄 Authentication Flow

```text
                    User
                      │
             ┌────────┴────────┐
             │                 │
      Email / Password      Google
             │                 │
             ▼                 ▼
      Login / Register    Google Identity
             │                 │
             │          Verify Credential
             │                 │
             └────────┬────────┘
                      │
                      ▼
               SmartStay Backend
                      │
              Find / Create User
                      │
                      ▼
                 Generate JWT
                      │
                      ▼
               Authenticated User
```

---

## 📈 Future Enhancements

- Property Reviews & Ratings
- Real-Time Chat System
- Google Maps Integration
- Email Notifications
- Advanced Search Filters
- Admin Analytics Dashboard
- Password Reset
- Two-Factor Authentication
- Booking Cancellation & Refund System
- Recommendation System

---

## 🎯 Learning Outcomes

Through this project, I gained practical experience in:

- Full Stack MERN Development
- REST API Design
- Authentication & Authorization
- Google OAuth Authentication
- Google Identity Services
- JWT Authentication
- User Account Management
- Cloud Storage Integration
- Payment Gateway Integration
- MongoDB Database Design
- React State Management
- Protected Routes
- Frontend & Backend Integration
- Environment Variable Management
- Deployment & Production Practices

---

## 📂 Repository

🔗 **GitHub Repository:**
https://github.com/shubhambatwal01/SmartStay

---

## 👨‍💻 Developer

### Shubham Batwal

Full Stack Developer | React | Node.js | MongoDB

📧 Email: [shubhambatwal14@gmail.com](mailto:shubhambatwal14@gmail.com)

🔗 LinkedIn: https://linkedin.com/in/shubhambatwal01/

🔗 GitHub: https://github.com/shubhambatwal01/

🌐 Portfolio: https://shubz-portfolio.vercel.app/

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

Your support helps me continue building and sharing more projects.
