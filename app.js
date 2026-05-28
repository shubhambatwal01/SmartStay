// External Module
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
require("dotenv").config();

const app = express();

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// For parsing application/json
app.use(express.json());

// Core Module
const path = require("path");
// Local Module
const rootDir = require("./utils/pathUtil");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const hostRouter = require("./routes/hostRouter");
const homeController = require("./controller/error");
const paymentRouter = require("./routes/paymentRouter");

app.set("view engine", "ejs"); // Set the view engine to EJS
app.set("views", "views");

// app.use((req, res, next) => {
//   // for console log the requests.
//   console.log(req.url, req.method);
//   next();
// });

const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});

app.use(
  session({
    secret: "Shubz0111",
    resave: false,
    saveUninitialized: true,
    store: store,
  }),
);

// app.use(express.urlencoded());

// middleware to set isLoggedIn for every request
// app.use((req, res, next) => {
//   req.session.isLoggedIn = req.session.isLoggedIn;
//   // req.session.isLoggedIn = req.get("Cookie")
//   //   ? req.get("Cookie").split("=")[1] === "true"
//   //   : false;
//   next();
// });

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

app.use(express.static(path.join(rootDir, "public"))); // CSS styling file

app.use(homeController.get404);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Mongoose connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`http://localhost:${process.env.PORT}/`);
    });
  })
  .catch((err) => {
    console.log("Mongoose connected to MongoDB", err);
  });
