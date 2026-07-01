const hostRouter = require("express").Router();
const path = require("path");
const homeController = require("../controller/homeController");
const hostController = require("../controller/hostController");
const {
  isLoggedIn,
  handleAsyncErrors,
} = require("../middleware/authMiddleware");

hostRouter.get("/add-home", isLoggedIn, hostController.getAddHome);
hostRouter.get("/addContact", isLoggedIn, homeController.getAddContact);
hostRouter.get(
  "/host-home",
  isLoggedIn,
  handleAsyncErrors(hostController.getHostHome),
);
hostRouter.get(
  "/edit-home/:id",
  isLoggedIn,
  handleAsyncErrors(hostController.getEditHome),
);

hostRouter.post(
  "/add-home",
  isLoggedIn,
  handleAsyncErrors(hostController.postAddHome),
);
hostRouter.post(
  "/addContact",
  isLoggedIn,
  handleAsyncErrors(homeController.postAddContact),
);
hostRouter.post(
  "/edit-home",
  isLoggedIn,
  handleAsyncErrors(hostController.postEditHome),
);
hostRouter.post(
  "/delete-home/:id",
  isLoggedIn,
  handleAsyncErrors(hostController.postDeleteHome),
);
hostRouter.delete(
  "/delete-home/:id",
  isLoggedIn,
  handleAsyncErrors(hostController.postDeleteHome),
);

module.exports = hostRouter;
