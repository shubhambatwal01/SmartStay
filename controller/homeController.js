const Home = require("../models/home");
const Favourite = require("../models/favourites");

// const RegisteredHomes = [];

// exports.getIndexHomes = (req, res, next) => {
//   Home.find().then((RegisteredHomes) => {
//     res.render("user/index-homes", {
//       RegisteredHomes,
//       pageTitle: "SmartStay",
//       currentPage: "index-home",
//       isLoggedIn: req.session.isLoggedIn,
//       user: {},
//     });
//   });
// };

exports.getHomes = (req, res, next) => {
  console.log("Sesion Object :", req.session);
  Home.find().then((RegisteredHomes) => {
    res.render("user/homeList", {
      RegisteredHomes,
      pageTitle: "SmartStay",
      currentPage: "homeList",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  }); //find() function from models/home.js
  // console.log("RegisteredHomes :", RegisteredHomes);
  //   next();
};

exports.getFavouriteList = (req, res, next) => {
  Favourite.find().then((favourites) => {
    const favouriteIds = favourites.map((favourite) =>
      favourite.homeId.toString(),
    );
    Home.find().then((RegisteredHomes) => {
      const favouriteHomes = RegisteredHomes.filter((home) =>
        favouriteIds.includes(home._id.toString()),
      );
      res.render("user/favourite-list", {
        favouriteHomes: favouriteHomes,
        pageTitle: "My Favourites",
        currentPage: "favourites",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
      });
    });
  });
};

exports.getBookings = (req, res, next) => {
  Home.find().then((RegisteredHomes) => {
    res.render("user/bookings", {
      RegisteredHomes,
      pageTitle: "Bookings",
      currentPage: "bookings",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getAddContact = (req, res, next) => {
  res.render("user/addContact", {
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
      res.render("user/home-detail", {
        home: home,
        pageTitle: "Home Detail",
        currentPage: "home-detail",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
      });
    }
  });
};

exports.postAddContact = (req, res, next) => {
  res.render("contactAdded", {
    pageTitle: "Thank You",
    currentPage: "contactAdded",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};

exports.postAddToFavourite = (req, res) => {
  const homeId = req.body.id;
  Favourite.findOne({ homeId: homeId }).then((home) => {
    if (home) {
      return res.redirect("/favourite-list");
    }
  });
  const fav = new Favourite({
    homeId: homeId,
  });
  fav
    .save()
    .then(() => {
      console.log("Added to Favourites");
      res.redirect("/favourite-list");
    })
    .catch((err) => {
      console.log("Error adding to Favourites", err);
    });
};

exports.postDeleteFavourite = (req, res, next) => {
  const homeId = req.params.id;
  console.log("Deleting Fav Home with ID:", homeId);
  Favourite.findOneAndDelete({ homeId: homeId })
    .then(() => {
      res.redirect("/favourite-list");
    })
    .catch((err) => {
      console.log("Error while deleting :", err);
    });
};

// exports.RegisteredHomes = RegisteredHomes;
