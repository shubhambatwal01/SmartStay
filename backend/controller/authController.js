const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
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
    user: {}, //passing empty because e are in login page and we dont have user data yet
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).json({
      message: "Post Login API",
      pageTitle: "Login",
      currentPage: "Login",
      isLoggedIn: false,
      errors: ["User does not exist"],
      oldInput: {
        email,
      },
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
      oldInput: {
        email,
      },
      user: {},
    });
  }
  req.session.isLoggedIn = true;
  req.session.user = user;
  // Save session before returning JSON
  await req.session.save((err) => {
    if (err) {
      console.log(err);
      return next(err);
    }

    const safeUser = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      userType: user.userType,
    };

    return res.status(200).json({
      success: true,
      isLoggedIn: true,
      user: safeUser,
      redirect: user.userType === "admin" ? "/host/host-home" : "/homes",
    });
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.status(201).json({
      success: true,
      message: "User LoggedOut Successfully",
    });
  });
  res.clearCookie("connect.sid");
};

exports.getSignup = (req, res, next) => {
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
      "Password must contain at least one special character (@$!%*?&)"
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
    .equals("true")
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
