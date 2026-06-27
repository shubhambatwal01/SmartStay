const Home = require("../models/home");
const cloudinary = require("../utils/cloudinaryConfig");

const streamUpload = (buffer, folder = "SmartStayHomes") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
    );
    stream.end(buffer);
  });
};

exports.getAddHome = (req, res, next) => {
  res.json({
    message: "Add Home Page",
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
  res.json({
    message: "Edit Home Page",
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

  res.json({
    message: "Host Home Page",
    pageTitle: "My Homes",
    currentPage: "hostHome",
    isLoggedIn: req.session.isLoggedIn,
    homes,
    user: req.session.user,
  });
};

exports.postAddHome = async (req, res) => {
  const { houseName, houseAddr, houseDesc, housePrice } = req.body;

  // console.log(req.file);

  if (!req.file) {
    return res.status(422).send("No image uploaded");
    res.redirect("/host/add-home");
  }
  try {
    const result = await streamUpload(req.file.buffer, "SmartStayHomes");

    const home = new Home({
      houseName: houseName,
      houseAddr: houseAddr,
      houseImg: result.secure_url,
      // houseImgId: result.public_id,
      houseDesc: houseDesc,
      housePrice: housePrice,
      owner: req.session.user._id,
    });

    await home.save();
    return res.status(201).json({
      success: true,
      message: "Home Added Successfully",
    });
  } catch (err) {
    console.error("Error Adding Home", err);
    return res.status(500).send("Server error");
  }
};

exports.postEditHome = async (req, res) => {
  const { id, houseName, houseAddr, houseDesc, housePrice } = req.body;
  const home = await Home.findOne({
    _id: id,
    owner: req.session.user._id,
  });

  if (!home) {
    return res.status(404).json({
      success: false,
      message: "Home not found or unauthorized",
    });
  }

  home.houseName = houseName;
  home.houseAddr = houseAddr;
  home.houseDesc = houseDesc;
  home.housePrice = housePrice;

  if (req.file) {
    if (home.houseImg) {
      try {
        await cloudinary.uploader.destroy(home.houseImg);
      } catch (err) {
        console.error("Error deleting old cloud image", err);
      }
    }

    try {
      const result = await streamUpload(req.file.buffer, "SmartStayHomes");
      home.houseImg = result.secure_url;
      // home.houseImgId = result.public_id;
    } catch (err) {
      console.error("Error uploading new image", err);
    }
  }

  await home.save();
  res.status(201).json({
    success: true,
    message: "Home Edited Successfully",
  });
};

exports.postDeleteHome = async (req, res, next) => {
  try {
    const home = await Home.findOne({
      _id: req.params.id,
      owner: req.session.user._id,
    });

    if (!home) return res.redirect("/host/host-home");
    if (home.houseImg) {
      try {
        await cloudinary.uploader.destroy(home.houseImg);
      } catch (err) {
        console.error("Error deleting cloud image on home delete", err);
      }
    }

    await Home.findOneAndDelete({
      _id: req.params.id,
      owner: req.session.user._id,
    });
    return res.status(201).json({
      success: true,
      message: "Home Deleted Successfully",
    });
  } catch (err) {
    console.log("Error while deleting", err);
    return res.status(500).send("Server error");
  }
};
