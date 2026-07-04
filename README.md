# 🏡 SmartStay — Full-Stack Vacation Rental & Home Booking Platform

**SmartStay** is a full-stack web application to **browse rental homes**, manage **favorites**, enable **secure authentication**, and take **online payments using Razorpay**.

> Built with a **React frontend** and a **Node.js/Express backend** (MongoDB + Mongoose).

---

## ✨ Features

### 👤 User Features

- User **Signup & Login**
- Secure password hashing (**bcryptjs**)
- Session-based authentication
- Browse available homes
- View home details
- Add/remove homes from **Favorites**

### 🏠 Host Features

- Add new property listings
- Upload property images (Cloudinary/Multer)
- Edit & delete listings
- Host-only access to their listings

### 💳 Payment Features

- **Razorpay** integration
- Create orders dynamically
- Payment verification and booking flow

---

## 🧰 Tech Stack

- **Frontend:** React, React Router, Tailwind CSS (Vite)
- **Backend:** Node.js, Express, Express-Session, Nodemon
- **Database:** MongoDB Atlas + Mongoose
- **Uploads:** Multer + Cloudinary (configured in backend)
- **Payments:** Razorpay

---

## 📁 Repository Structure

```
Fullstack-SmartStay/
  backend/
    app.js
    routes/
    controller/
    middleware/
    models/
    config/
    public/
    views/
  frontend/
    src/
    components/
    pages/
    services/
    index.html
```

---

## 🚀 Getting Started

### 1) Clone

```bash
git clone https://github.com/shubhambatwal01/SmartStay.git
cd SmartStay
```

### 2) Backend Setup

```bash
cd Fullstack-SmartStay/backend
npm install
```

Create a **.env** file inside `backend/` (or root depending on your current config) with values like:

- `PORT`
- `MONGO_URL`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- Session/Cloudinary variables (as required by your config files)

Run backend:

```bash
npm start
```

### 3) Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Open the frontend URL shown in the terminal.

---

## 🔐 Environment Variables (Common)

Make sure you have the following keys configured:

- `MONGO_URL`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- Session secret(s)
- Cloudinary credentials (if enabled)

---

## 🖼️ Screenshots

(Example preview)

<img width="1920" height="1080" alt="SmartStay screenshot" src="https://github.com/user-attachments/assets/65e13d17-1859-475b-a474-5a7b7fa817cb" />

---

## 👨‍💻 Developer

**Shubham Batwal** — Full Stack Developer

- LinkedIn: https://www.linkedin.com/in/shubhambatwal01
- Portfolio: https://shubzportfolio.vercel.app

---

## 📝 Note

If you want this README to include **exact** `.env` variable names from your current codebase, I can generate that section precisely by reading the config files in `backend/config/`.
