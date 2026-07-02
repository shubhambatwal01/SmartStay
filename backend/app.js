const mongoose = require("mongoose");
const multer = require("multer");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/dbConfig");
const cors = require("cors");

const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const hostRouter = require("./routes/hostRouter");
const homeController = require("./controller/error");
const paymentRouter = require("./routes/paymentRouter");

const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});

const fileFilter = (req, file, cb) => {
  console.log(file);
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 500 * 1024, // 500 KB limit
  },
};

const allowedOrigins = [process.env.FRONTEND_URL].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(multer(multerOptions).single("houseImg"));
app.use(express.json());

app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  }),
);

app.use(authRouter);
app.use(userRouter);
app.use("/host", hostRouter);
app.use("/payment", paymentRouter);
app.locals.razorpayKey = process.env.RAZORPAY_KEY_ID;
app.use(homeController.get404);

app.use((err, req, res, next) => {
  console.error("Global error handler:", err);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS error: Your domain is not allowed",
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

connectDB(app);
