const { check, validationResult } = require("express-validator");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const getGoogleClient = () => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is not configured on the backend");
  }

  return new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
};

const createSafeUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  userType: user.userType,
  profileImage: user.profileImage || "",
  authProvider: user.authProvider || "local",
});

const saveLoginSession = (req, user) =>
  new Promise((resolve, reject) => {
    req.session.isLoggedIn = true;
    req.session.user = createSafeUser(user);

    req.session.save((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });

exports.getLogin = (req, res) => {
  res.json({
    message: "Get Login API",
    pageTitle: "Login",
    currentPage: "Login",
    isLoggedIn: false,
    errors: [],
    oldInput: {
      fullName: "",
      email: "",
    },
    user: {},
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(422).json({
        message: "Post Login API",
        pageTitle: "Login",
        currentPage: "Login",
        isLoggedIn: false,
        errors: ["User does not exist"],
        oldInput: { email },
        user: {},
      });
    }

    if (!user.password) {
      return res.status(422).json({
        success: false,
        isLoggedIn: false,
        errors: [
          "This account uses Google Sign-In. Please continue with Google.",
        ],
        oldInput: { email },
        user: {},
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(422).json({
        message: "Password Match API",
        pageTitle: "Login",
        currentPage: "Login",
        isLoggedIn: false,
        errors: ["Invalid password"],
        oldInput: { email },
        user: {},
      });
    }

    await saveLoginSession(req, user);

    return res.status(200).json({
      success: true,
      isLoggedIn: true,
      user: createSafeUser(user),
      redirect: user.userType === "admin" ? "/host/host-home" : "/homes",
    });
  } catch (error) {
    next(error);
  }
};

exports.postGoogleAuth = async (req, res, next) => {
  try {
    const {
      credential,
      mode = "login",
      userType = "user",
      terms = false,
    } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    if (mode === "signup" && !(terms === true || terms === "true")) {
      return res.status(400).json({
        success: false,
        message: "Please accept the Terms and Conditions before signing up.",
      });
    }

    const googleClient = getGoogleClient();
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.sub || !payload?.email) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google account",
      });
    }

    if (!payload.email_verified) {
      return res.status(401).json({
        success: false,
        message: "Please use a verified Google email address",
      });
    }

    const email = payload.email.toLowerCase();
    const googleId = payload.sub;
    const validUserType = ["user", "admin"].includes(userType)
      ? userType
      : "user";

    let user = await User.findOne({
      $or: [{ googleId }, { email }],
    });

    let isNewUser = false;

    if (!user) {
      user = await User.create({
        fullName: payload.name || email.split("@")[0],
        email,
        googleId,
        authProvider: "google",
        profileImage: payload.picture || "",
        userType: mode === "signup" ? validUserType : "user",
      });

      isNewUser = true;
    } else {
      let shouldSave = false;

      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = user.password ? "both" : "google";
        shouldSave = true;
      }

      if (!user.profileImage && payload.picture) {
        user.profileImage = payload.picture;
        shouldSave = true;
      }

      if (shouldSave) {
        await user.save();
      }
    }

    await saveLoginSession(req, user);

    return res.status(200).json({
      success: true,
      message: isNewUser
        ? "Google signup successful"
        : "Google login successful",
      isNewUser,
      isLoggedIn: true,
      user: createSafeUser(user),
      redirect: user.userType === "admin" ? "/host/host-home" : "/homes",
    });
  } catch (error) {
    console.error("Google Auth Error:", error.message);

    if (
      error.message?.includes("Wrong recipient") ||
      error.message?.includes("Invalid token signature") ||
      error.message?.includes("Token used too late") ||
      error.message?.includes("Invalid value")
    ) {
      return res.status(401).json({
        success: false,
        message: "Google authentication failed. Please try again.",
      });
    }

    next(error);
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }

    res.clearCookie("connect.sid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      success: true,
      message: "User LoggedOut Successfully",
    });
  });
};

exports.getSignup = (req, res) => {
  res.json({
    message: "Get SignUp API",
    pageTitle: "Signup",
    currentPage: "Signup",
    isLoggedIn: false,
    errors: [],
    oldInput: {
      fullName: "",
      email: "",
      userType: "",
      terms: false,
    },
    user: {},
  });
};

exports.postSignup = [
  check("fullName")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Full name can contain only letters and spaces"),

  check("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail()
    .custom(async (email) => {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      return true;
    }),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&]/)
    .withMessage(
      "Password must contain at least one special character (@$!%*?&)",
    ),

  check("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),

  check("userType")
    .notEmpty()
    .withMessage("Please select a user type")
    .isIn(["user", "admin"])
    .withMessage("Invalid user type"),

  check("terms")
    .custom((value) => value === true || value === "true")
    .withMessage("You must accept the terms and conditions"),

  async (req, res) => {
    try {
      const { fullName, email, password, userType } = req.body;

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array().map((err) => ({
            field: err.path,
            message: err.msg,
          })),
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        fullName,
        email,
        password: hashedPassword,
        authProvider: "local",
        userType,
      });

      await user.save();

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          userType: user.userType,
        },
      });
    } catch (error) {
      console.error("Signup Error:", error);

      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  },
];
