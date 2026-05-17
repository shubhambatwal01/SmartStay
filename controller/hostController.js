const Home = require("../models/home");

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home",
    currentPage: "addHome",
    editing: false,
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.id;
  // const editing = req.query.editing === "true"; //compare true for boolean value
  Home.findById(homeId).then((home) => {
    // console.log("Home Details Are Founded :", home);
    if (!home) {
      console.log("Home not found for editing.");
      return res.redirect("/host-home");
    }
    console.log(homeId, home);
    res.render("host/edit-home", {
      home: home,
      pageTitle: "Edit Home",
      currentPage: "Edit Home",
      editing: true,
      isLoggedIn: req.session.isLoggedIn,
    });
  });
};

exports.getHostHome = (req, res, next) => {
  Home.find().then((RegisteredHomes) => {
    res.render("host/host-home", {
      RegisteredHomes,
      pageTitle: "Host-Home",
      currentPage: "host-home",
      isLoggedIn: req.session.isLoggedIn,
    });
  });
};

exports.postAddHome = (req, res) => {
  const { houseName, houseAddr, houseImg, houseDesc, housePrice } = req.body; //destructuring req.body
  // Create new home without _id (MongoDB will generate one)
  const home = new Home({
    houseName: houseName,
    houseAddr: houseAddr,
    houseImg: houseImg,
    houseDesc: houseDesc,
    housePrice: housePrice,
  }); //Home Object from models/home.js
  home
    .save()
    .then(() => res.redirect("/host/host-home"))
    .catch((err) => {
      console.error("Error Adding Home", err);
      res.status(500).send("Server error");
    });
};

exports.postEditHome = (req, res) => {
  const { id, houseName, houseAddr, houseImg, houseDesc, housePrice } =
    req.body;
  Home.findById(id).then((home) => {
    home.houseName = houseName;
    home.houseAddr = houseAddr;
    home.houseImg = houseImg;
    home.houseDesc = houseDesc;
    home.housePrice = housePrice;
    home
      .save()
      .then(() => res.redirect("/host/host-home"))
      .catch((err) => {
        console.error("Error editing home", err);
        res.status(500).send("Server error");
      })
      .catch((err) => {
        console.log("Error Finding Home for Edit :", err);
      });
  });
};

exports.postDeleteHome = (req, res, next) => {
  const id = req.params.id;
  console.log("Deleting Home with ID:", id);
  Home.findByIdAndDelete(id)
    .then(() => {
      res.redirect("/host/host-home");
    })
    .catch((err) => {
      console.log("Error while deleting", err);
    });
};
