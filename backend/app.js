const mongoose = require("mongoose");
const multer = require("multer");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/dbConfig");
const cors = require("cors");

const rootDir = require("./utils/pathUtil");
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

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(multer(multerOptions).single("houseImg"));
app.use(express.json());

app.use(
  session({
    secret: "Shubz0111",
    resave: false,
    saveUninitialized: true,
    store: store,
  }),
);

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).send("File size should be 500 KB");
    }
  }
  next(err);
});

app.use(authRouter);
app.use(userRouter);
app.use("/api/host", (req, res, next) => {
  if (req.session.isLoggedIn) {
    return next();
  } else {
    res.redirect("/login");
  }
});
app.use("/api/host", hostRouter);
app.use("/api/payment", paymentRouter);
app.locals.razorpayKey = process.env.RAZORPAY_KEY_ID;
app.use(homeController.get404);

connectDB(app);
