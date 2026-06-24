const Home = require("../models/home");
const User = require("../models/user");

// const RegisteredHomes = [];

exports.getIndexHomes = (req, res, next) => {
  Home.find().then((RegisteredHomes) => {
    res.status(200).json({
      success: true,
      homes: RegisteredHomes,
      pageTitle: "SmartStay",
      currentPage: "SmartStay Homes",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getHomes = (req, res, next) => {
  console.log("Sesion Object :", req.session);
  Home.find().then((RegisteredHomes) => {
    res.status(200).json({
      success: true,
      homes: RegisteredHomes,
      pageTitle: "SmartStay",
      currentPage: "homeList",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  }); //find() function from models/home.js
  // console.log("RegisteredHomes :", RegisteredHomes);
  //   next();
};

exports.getFavouriteList = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate("favourites");
  const favouriteHomes = user.favourites;
  res.status(200).json({
    favouriteHomes,
    pageTitle: "My Favourites",
    currentPage: "favourites",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};

exports.getBookings = (req, res, next) => {
  Home.find().then((RegisteredHomes) => {
    res.status(200).json({
      success: true,
      homes: RegisteredHomes,
      bookings,
      pageTitle: "Bookings",
      currentPage: "bookings",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getAddContact = (req, res, next) => {
  res.status(200).json({
    pageTitle: "Contact Us",
    currentPage: "addContact",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};

exports.getDetails = (req, res, next) => {
  const homeId = req.params.id;
  Home.findById(homeId).then((home) => {
    console.log("Home Details Are Founded :", home);
    if (!home) {
      console.log("Home is not found");
      res.redirect("/homes");
    } else {
      res.status(200).json({
        home,
        pageTitle: "Home Detail",
        currentPage: "home-detail",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
      });
    }
  });
};

exports.postAddContact = (req, res, next) => {
  res.status(200).json({
    pageTitle: "Thank You",
    currentPage: "contactAdded",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};

exports.postAddToFavourite = async (req, res) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (!user.favourites.includes(homeId)) {
    user.favourites.push(homeId);
    await user.save();
  }
  res.redirect("/favourite-list");
};

exports.postDeleteFavourite = async (req, res, next) => {
  const homeId = req.params.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (user.favourites.includes(homeId)) {
    user.favourites.pull(homeId);
    await user.save();
  }
  res.redirect("/favourite-list");
};

// exports.RegisteredHomes = RegisteredHomes;
