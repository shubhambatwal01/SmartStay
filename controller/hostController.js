const Home = require("../models/home");
const fs = require("fs");
const path = require("path");
const rootDir = require("../utils/pathUtil");

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home",
    currentPage: "addHome",
    editing: false,
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};

exports.getEditHome = async (req, res, next) => {
  const home = await Home.findOne({
    _id: req.params.id,
    owner: req.session.user._id,
  });

  if (!home) {
    return res.status(403).send("Unauthorized");
  }
  res.render("host/edit-home", {
    pageTitle: "Edit Home",
    currentPage: "editHome",
    editing: true,
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
    home,
  });
  const homeId = req.params.id;
};

exports.getHostHome = async (req, res, next) => {
  const homes = await Home.find({
    owner: req.session.user._id,
  });

  res.render("host/host-home", {
    pageTitle: "My Homes",
    currentPage: "hostHome",
    isLoggedIn: req.session.isLoggedIn,
    homes,
    user: req.session.user,
  });
};

exports.postAddHome = async (req, res) => {
  const { houseName, houseAddr, houseDesc, housePrice } = req.body; //destructuring req.body
  // Create new home without _id (MongoDB will generate one)
  console.log(req.file);

  if (!req.file) {
    return res.status(422).send("No image uploaded");
    res.redirect("/host/add-home");
  }

  // Normalize path to use forward slashes and make it an absolute URL path
  const filePath = req.file.path.replace(/\\/g, "/");
  const houseImg = filePath.startsWith("/") ? filePath : "/" + filePath;

  const home = new Home({
    houseName: houseName,
    houseAddr: houseAddr,
    houseImg: houseImg,
    houseDesc: houseDesc,
    housePrice: housePrice,
    owner: req.session.user._id,
  }); //Home Object from models/home.js
  await home
    .save()
    .then(() => res.redirect("/host/host-home"))
    .catch((err) => {
      console.error("Error Adding Home", err);
      res.status(500).send("Server error");
    });
};

exports.postEditHome = async (req, res) => {
  const { id, houseName, houseAddr, houseDesc, housePrice } = req.body;
  const home = await Home.findOne({
    _id: id,
    owner: req.session.user._id,
  });
  home.houseName = houseName;
  home.houseAddr = houseAddr;
  home.houseDesc = houseDesc;
  home.housePrice = housePrice;

  if (req.file) {
    // Delete old image from uploads folder (resolve full path)
    try {
      const oldImgRelative = home.houseImg.startsWith("/")
        ? home.houseImg.slice(1)
        : home.houseImg;
      const oldImgFull = path.join(rootDir, oldImgRelative);
      fs.unlink(oldImgFull, (err) => {
        if (err) console.error("Error deleting old image", err);
      });
    } catch (err) {
      console.error("Error resolving old image path", err);
    }

    // store new image as a URL path (leading slash, forward slashes)
    const newFilePath = req.file.path.replace(/\\/g, "/");
    home.houseImg = newFilePath.startsWith("/")
      ? newFilePath
      : "/" + newFilePath;
  }

  await home.save();
  res.redirect("/host/host-home");
};

exports.postDeleteHome = async (req, res, next) => {
  await Home.findOneAndDelete({
    _id: req.params.id,
    owner: req.session.user._id,
  })
    .then(() => {
      res.redirect("/host/host-home");
    })
    .catch((err) => {
      console.log("Error while deleting", err);
    });
};
