const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    currentPage: "Login",
    isLoggedIn: false,
    errors: [],
    oldInput: {
      fullName: "",
      email: "",
    },
  });
};

exports.postLogin = async (req, res, next) => {
  const { fullName, email, userType } = req.body;
  console.log("Login attempt with:", { fullName, email });
  const user = await User.findOne({ fullName, email });
  if (!user) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      currentPage: "Login",
      isLoggedIn: false,
      errors: ["User not found with the provided details"],
      oldInput: {
        fullName,
        email,
      },
    });
  }
  req.session.isLoggedIn = true;
  res.redirect("/");
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
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
    .normalizeEmail(),
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
      return res.status(422).render("auth/signup", {
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
          res.redirect("/login");
        })
        .catch((err) => {
          console.error(err);
          return res.status(422).render("auth/signup", {
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
          });
        });
    });
  },
];
