const Home = require("../models/home");
const cloudinary = require("../config/cloudinaryConfig");

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
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const home = await Home.findOne({
      _id: req.params.id,
      owner: req.session.user._id,
    });

    if (!home) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized - Home not found or does not belong to you",
      });
    }

    res.status(200).json({
      success: true,
      message: "Edit Home Page",
      pageTitle: "Edit Home",
      currentPage: "editHome",
      editing: true,
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
      home,
    });
  } catch (error) {
    console.error("Error fetching home for edit:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch home details",
      error: error.message,
    });
  }
};

exports.getHostHome = async (req, res, next) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const homes = await Home.find({
      owner: req.session.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Host Home Page",
      pageTitle: "My Homes",
      currentPage: "hostHome",
      isLoggedIn: req.session.isLoggedIn,
      homes: homes || [],
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error fetching host homes:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch homes",
      error: error.message,
    });
  }
};

exports.postAddHome = async (req, res) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    console.log(req.body);
    const {
      houseName,
      houseAddr,
      houseDesc,
      housePrice,
      bhk,
      wifi,
      washingMachine,
      caretaker,
      kitchen,
      parking,
      ac,
      smartTv,
      attachedBathroom,
    } = req.body;

    if (!req.file) {
      return res.status(422).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const result = await streamUpload(req.file.buffer, "SmartStayHomes");

    const home = new Home({
      houseName: houseName,
      houseAddr: houseAddr,
      houseImg: result.secure_url,
      houseDesc: houseDesc,
      housePrice: housePrice,
      bhk: bhk,
      wifi: wifi,
      washingMachine: washingMachine,
      caretaker: caretaker,
      kitchen: kitchen,
      parking: parking,
      ac: ac,
      smartTv: smartTv,
      attachedBathroom: attachedBathroom,
      owner: req.session.user._id,
    });

    await home.save();
    return res.status(201).json({
      success: true,
      message: "Home Added Successfully",
    });
  } catch (err) {
    console.error("Error Adding Home:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while adding home",
      error: err.message,
    });
  }
};

exports.postEditHome = async (req, res) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const {
      id,
      houseName,
      houseAddr,
      houseDesc,
      housePrice,
      bhk,
      wifi,
      washingMachine,
      caretaker,
      kitchen,
      parking,
      ac,
      smartTv,
      attachedBathroom,
    } = req.body;

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
    home.bhk = bhk;
    home.wifi = wifi;
    home.washingMachine = washingMachine;
    home.caretaker = caretaker;
    home.kitchen = kitchen;
    home.parking = parking;
    home.ac = ac;
    home.smartTv = smartTv;
    home.attachedBathroom = attachedBathroom;

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
      } catch (err) {
        console.error("Error uploading new image", err);
        return res.status(500).json({
          success: false,
          message: "Error uploading image",
          error: err.message,
        });
      }
    }

    await home.save();
    res.status(201).json({
      success: true,
      message: "Home Edited Successfully",
    });
  } catch (err) {
    console.error("Error editing home:", err);
    res.status(500).json({
      success: false,
      message: "Server error while editing home",
      error: err.message,
    });
  }
};

exports.postDeleteHome = async (req, res, next) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const home = await Home.findOne({
      _id: req.params.id,
      owner: req.session.user._id,
    });

    if (!home) {
      return res.status(403).json({
        success: false,
        message: "Home not found or unauthorized",
      });
    }

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

    return res.status(200).json({
      success: true,
      message: "Home Deleted Successfully",
    });
  } catch (err) {
    console.error("Error while deleting home:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting home",
      error: err.message,
    });
  }
};
