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
const { Timestamp } = require("bson");

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

const normalizeOrigin = (value) => value?.replace(/\/+$/, "");
const frontendUrl = normalizeOrigin(process.env.FRONTEND_URL);
const allowedOrigins = [
  frontendUrl,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const requestOrigin = normalizeOrigin(origin);

    if (allowedOrigins.includes(requestOrigin)) {
      callback(null, true);
    } else {
      console.warn(`CORS rejected origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
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

// ============================================
// 🔧 STARTUP CONFIGURATION CHECK
// ============================================
const checkConfiguration = () => {
  console.log("\n" + "=".repeat(60));
  console.log("🚀 SMARTSTAY STARTUP CONFIGURATION");
  console.log("=".repeat(60));

  const configs = {
    Environment: process.env.NODE_ENV || "development",
    Port: process.env.PORT || 3000,
    MongoDB: process.env.MONGO_URL ? "✓ Connected" : "✗ Missing",
    Razorpay: process.env.RAZORPAY_KEY_ID ? "✓ Configured" : "✗ Missing",
    "Frontend URL": process.env.FRONTEND_URL || "localhost",
  };

  Object.entries(configs).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });

  console.log("\n📧 EMAIL CONFIGURATION:");
  const emailConfigs = {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SECURE: process.env.SMTP_SECURE,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS
      ? `[SET - ${process.env.SMTP_PASS.length} chars]`
      : "[NOT SET]",
    SMTP_FROM: process.env.SMTP_FROM,
    HOST_NOTIFICATION_EMAIL: process.env.HOST_NOTIFICATION_EMAIL,
  };

  const emailReady =
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
  console.log(`  Status: ${emailReady ? "✓ READY" : "✗ NOT CONFIGURED"}`);

  Object.entries(emailConfigs).forEach(([key, value]) => {
    const status = value ? "✓" : "✗";
    console.log(`  ${status} ${key}: ${value || "NOT SET"}`);
  });

  console.log("=".repeat(60) + "\n");

  if (!emailReady && process.env.NODE_ENV === "production") {
    console.warn("⚠️  WARNING: Email is not configured on Render!");
    console.warn("   Booking confirmation emails will NOT be sent.");
    console.warn("   See RENDER_EMAIL_SETUP.md for setup instructions.\n");
  }
};

checkConfiguration();
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
