// Core Module
const path = require("path");

// External Module
const mongoose = require("mongoose");
const multer = require("multer");
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
require("dotenv").config();
const os = require("os");
const app = express();

// Local Module
const rootDir = require("./utils/pathUtil");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const hostRouter = require("./routes/hostRouter");
const homeController = require("./controller/error");
const paymentRouter = require("./routes/paymentRouter");

app.set("view engine", "ejs"); // Set the view engine to EJS
app.set("views", "views");

const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});

const fileFilter = (req, file, cb) => {
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
};

app.use(express.urlencoded({ extended: true }));
app.use(multer(multerOptions).single("houseImg"));
app.use(express.json());
app.use(express.static(path.join(rootDir, "public")));
app.use("/uploads", express.static(path.join(rootDir, "uploads")));
app.use("/host/uploads", express.static(path.join(rootDir, "uploads")));
app.use("/homes/uploads", express.static(path.join(rootDir, "uploads")));

app.use(
  session({
    secret: "Shubz0111",
    resave: false,
    saveUninitialized: true,
    store: store,
  }),
);

app.use(authRouter);
app.use(userRouter);
app.use("/host", (req, res, next) => {
  if (req.session.isLoggedIn) {
    return next();
  } else {
    res.redirect("/login");
  }
});
app.use("/host", hostRouter);

app.use("/payment", paymentRouter);
app.locals.razorpayKey = process.env.RAZORPAY_KEY_ID;

app.use(homeController.get404);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Mongoose connected to MongoDB");
    app.listen(PORT, HOST, () => {
      const nets = os.networkInterfaces();
      let localIp = "localhost";
      for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
          if (net.family === "IPv4" && !net.internal) {
            localIp = net.address;
            break;
          }
        }
        if (localIp !== "localhost") break;
      }
      console.log(`Local: http://localhost:${PORT}/`);
      console.log(`LAN:   http://${localIp}:${PORT}/`);
    });
  })
  .catch((err) => {
    console.log("Mongoose connection error", err);
  });
