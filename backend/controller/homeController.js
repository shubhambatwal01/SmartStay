const Home = require("../models/home");
const User = require("../models/user");
const Booking = require("../models/bookings");

// const RegisteredHomes = [];

exports.getIndexHomes = (req, res, next) => {
  Home.find().then((RegisteredHomes) => {
    res.status(200).json({
      success: true,
      homes: RegisteredHomes,
      pageTitle: "SmartStay",
      currentPage: "IndexHomes",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getHomes = (req, res, next) => {
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
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const userId = req.session.user._id;
    const user = await User.findById(userId).populate("favourites");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const favouriteHomes = user.favourites || [];
    res.status(200).json({
      success: true,
      favouriteHomes,
      pageTitle: "My Favourites",
      currentPage: "favourites",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error fetching favourites:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch favourites",
      error: error.message,
    });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.session.user._id,
    }).populate("home", "houseName houseImg houseAddr housePrice");

    res.status(200).json({
      success: true,
      bookings,
      pageTitle: "Your Bookings",
      currentPage: "Bookings",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch bookings",
    });
  }
};

exports.getAddContact = (req, res, next) => {
  res.status(200).json({
    message: "Get AddContact API",
    pageTitle: "Contact Us",
    currentPage: "addContact",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};

exports.getDetails = (req, res, next) => {
  const homeId = req.params.id;
  Home.findById(homeId)
    .populate("owner", "fullName")
    .then((home) => {
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
    success: true,
    message: "Post AddContact API",
    pageTitle: "Thank You",
    currentPage: "contactAdded",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};

exports.postAddToFavourite = async (req, res) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const homeId = req.body.id;
    const userId = req.session.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.favourites.includes(homeId)) {
      user.favourites.push(homeId);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Added to favourites",
      favourites: user.favourites,
    });
  } catch (error) {
    console.error("Error adding to favourites:", error);
    res.status(500).json({
      success: false,
      message: "Unable to add to favourites",
      error: error.message,
    });
  }
};

exports.postDeleteFavourite = async (req, res, next) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const homeId = req.params.id;
    const userId = req.session.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.favourites.includes(homeId)) {
      user.favourites.pull(homeId);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Favourite removed",
      favourites: user.favourites,
    });
  } catch (error) {
    console.error("Error deleting favourite:", error);
    res.status(500).json({
      success: false,
      message: "Unable to delete favourite",
      error: error.message,
    });
  }
};

// exports.RegisteredHomes = RegisteredHomes;
