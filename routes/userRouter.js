const path = require("path"); // Core Module
const userRouter = require("express").Router(); // External Module
const rootDir = require("../utils/pathUtil"); // Local Module
const { RegisteredHomes } = require("./hostRouter");
const homeController = require("../controller/homeController");

// userRouter.get("/", homeController.getIndexHomes);
userRouter.get("/homes", homeController.getHomes);
userRouter.get("/bookings", homeController.getBookings);
userRouter.get("/favourite-list", homeController.getFavouriteList);
userRouter.get("/homes/:id", homeController.getDetails);

userRouter.post("/favourite-list", homeController.postAddToFavourite);
userRouter.post("/favourites/delete/:id", homeController.postDeleteFavourite);

module.exports = userRouter;
