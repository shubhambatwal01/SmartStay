const path = require("path"); // Core Module
const userRouter = require("express").Router(); // External Module
const { RegisteredHomes } = require("./hostRouter");
const homeController = require("../controller/homeController");

userRouter.get("/", homeController.getIndexHomes);
userRouter.get("/homes", homeController.getHomes);
userRouter.get("/bookings", homeController.getBookings);
userRouter.get("/favourites", homeController.getFavouriteList);
userRouter.get("/homes/:id", homeController.getDetails);
userRouter.get("/bookings", homeController.getBookings);

userRouter.post("/favourites", homeController.postAddToFavourite);
userRouter.delete("/favourites/delete/:id", homeController.postDeleteFavourite);
userRouter.post("/favourites/delete/:id", homeController.postDeleteFavourite);

module.exports = userRouter;
