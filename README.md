# 🏡SmartStay - Rental home booking system

_A Full-Stack Vacation Rental & Home Booking Platform_
_Browse homes, manage property listings, save favorites, authenticate users securely, and integrate online payments using Razorpay._

## 🚀 Features
   ## 👤 User Features
   1. User Registration & Login
   2. Secure Password Hashing using BCrypt
   3. Session-based Authentication
   4. Browse Available Homes
   5. View Detailed Home Information
   6. Add Homes to Favorites
   7. Remove Homes from Favorites
   8. Responsive UI for Desktop & Mobile
   ## 🏠 Admin/Host Features
   1. Add New Property Listings
   2. Upload Property Images
   3. Edit Existing Listings
   4. Delete Listings
   5. View Only Your Own Listed Properties
   6. Protected Routes using Authentication
   ## 💳 Payment Features
   1. Razorpay Payment Gateway Integration
   2. Dynamic Order Creation
   3. Secure Payment Processing
---

## 🛠️ Tech Stack
   **Frontend**: HTML5, CSS3, Tailwind CSS, EJS 
   **Backend**: Node.js, Express.js, Nodemon
   **Database**: MongoDB Atlas, Mongoose ODM
   **Authentication & Security**: Express Session, BCryptJS, Express Validator
   **File Uploads**: Multer
   **Payments**: Razorpay
   **Deployment**: Render
---

## 📂 Folder Structure
```
   SmartStay/
   ├── controllers/
   │   ├── authController.js
   │   ├── homeController.js
   │   ├── hostController.js
   │   ├── favouriteController.js
   │   └── paymentController.js
   ├── models/
   │   ├── home.js
   │   ├── user.js
   │   └── favourite.js
   ├── routes/
   │   ├── authRouter.js
   │   ├── homeRouter.js
   │   ├── hostRouter.js
   │   ├── favouriteRouter.js
   │   └── paymentRouter.js
   ├── middleware/
   │   ├── auth.js
   │   ├── isLoggedIn.js
   │   ├── isHost.js
   │   └── uploadMiddleware.js
   ├── views/
   │   ├── auth/
   │   │   ├── login.ejs
   │   │   └── signup.ejs
   │   ├── home/
   │   │   ├── index.ejs
   │   │   ├── home-list.ejs
   │   │   ├── home-detail.ejs
   │   │   └── favourites.ejs
   │   ├── host/
   │   │   ├── host-home-list.ejs
   │   │   ├── add-home.ejs
   │   │   └── edit-home.ejs
   │   ├── payment/
   │   │   └── checkout.ejs
   │   └── partials/
   │       ├── head.ejs
   │       ├── nav.ejs
   │       ├── footer.ejs
   │       └── message.ejs
   ├── public/
   │   │
   │   ├── css/
   │   │   ├── input.css
   │   │   └── output.css
   │   ├── js/
   │   │   ├── navbar.js
   │   │   ├── favourite.js
   │   │   └── payment.js
   │   └── images/
   ├── uploads/
   │   └── home-images/
   ├── config/
   │   ├── db.js
   │   ├── session.js
   │   └── razorpay.js
   ├── utils/
   │   ├── validation.js
   │   ├── helpers.js
   │   └── constants.js
   ├── .env
   ├── .gitignore
   ├── app.js
   ├── package.json
   ├── package-lock.json
   └── tailwind.config.js
```
---

## ⚙️ Installation
   1. **Clone the repository:**
   
      ```
      git clone https://github.com/shubhambatwal01/SmartStay.git
      cd SmartStay
      ```
   2. Environment Variables
      Create a .env file in the root directory.
      ```
         PORT=1101
         MONGO_URL=your_mongodb_connection_string
         RAZORPAY_KEY_ID=your_razorpay_key
         RAZORPAY_KEY_SECRET=your_razorpay_secret
      ```
   3. Install dependencies:
      ```
      npm install
      ```
   5. Start the development server:
      ```
      npm start
      npm run tailwindcss
      ```
   6. Open http://localhost:1101 to view it in your browser.
---
      
## Screenshots

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/65e13d17-1859-475b-a474-5a7b7fa817cb" />

---

## 👨‍💻 Developer

### Shubham Batwal
Full Stack Developer

🔗 LinkedIn:  
https://www.linkedin.com/in/shubhambatwal01

🌐 Portfolio:  
https://shubzportfolio.vercel.app

---

### 💡 SmartStay – Find, Host, and Manage Homes with Ease. 🏡✨
