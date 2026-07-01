const path = require("path"); // Core Module
const userRouter = require("express").Router(); // External Module
const { RegisteredHomes } = require("./hostRouter");
const homeController = require("../controller/homeController");
const {
  isLoggedIn,
  handleAsyncErrors,
} = require("../middleware/authMiddleware");

userRouter.get("/", homeController.getIndexHomes);
userRouter.get("/homes", homeController.getHomes);
userRouter.get(
  "/bookings",
  isLoggedIn,
  handleAsyncErrors(homeController.getBookings),
);
userRouter.get(
  "/favourites",
  isLoggedIn,
  handleAsyncErrors(homeController.getFavouriteList),
);
userRouter.get("/homes/:id", homeController.getDetails);

userRouter.post(
  "/favourites",
  isLoggedIn,
  handleAsyncErrors(homeController.postAddToFavourite),
);
userRouter.delete(
  "/favourites/delete/:id",
  isLoggedIn,
  handleAsyncErrors(homeController.postDeleteFavourite),
);
userRouter.post(
  "/favourites/delete/:id",
  isLoggedIn,
  handleAsyncErrors(homeController.postDeleteFavourite),
);

module.exports = userRouter;
