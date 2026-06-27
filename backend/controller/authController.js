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
  console.log("Login attempt with:", { email, password });
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
  console.log("Password match result:", password, user.password, passwordMatch);
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
    .withMessage("Full name must be between 2 and 100 characters long")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Full name must contain only letters and spaces"),
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail()
    .custom(async (value) => {
      const existingUser = await User.findOne({ email: value });
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
    .withMessage("Password must contain at least one digit")
    .matches(/[@$!%*?&]/)
    .withMessage(
      "Password must contain at least one special character (@, $, !, %, *, ?, &)",
    ),
  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
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
    .notEmpty()
    .withMessage("You must accept the terms and conditions"),

  (req, res, next) => {
    const { fullName, email, password, userType } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status().json({
        message: "Post SignUp API",
        pageTitle: "Signup",
        currentPage: "Signup",
        errors: errors.array().map((err) => err.msg),
        oldInput: {
          fullName,
          email,
          password,
          userType,
          terms: req.body.terms ? true : false,
        },
        isLoggedIn: false,
        user: {},
      });
    }

    bcrypt.hash(password, 12).then((hashedPassword) => {
      const user = new User({
        fullName,
        email,
        password: hashedPassword,
        userType,
      });
      user
        .save()
        .then(() => {
          res.status(201).json({
            success: true,
            message: "User Registered Successfully",
          });
        })
        .catch((err) => {
          console.error(err);
          return res.status(422).json({
            message: "Hashed SignUp API",
            pageTitle: "Signup",
            currentPage: "Signup",
            errors: errors.array(),
            errorMessage: errors
              .array()
              .map((err) => err.msg)
              .join("\n"),
            oldInput: {
              fullName,
              email,
              password,
              userType,
              terms: req.body.terms ? true : false,
            },
            isLoggedIn: false,
            user: {},
          });
        });
    });
  },
];
