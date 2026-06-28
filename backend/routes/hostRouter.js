const hostRouter = require("express").Router();
const path = require("path");
const homeController = require("../controller/homeController");
const hostController = require("../controller/hostController");

hostRouter.get("/add-home", hostController.getAddHome);
hostRouter.get("/addContact", homeController.getAddContact);
hostRouter.get("/host-home", hostController.getHostHome);
hostRouter.get("/edit-home/:id", hostController.getEditHome);

// const RegisteredHomes = [];

hostRouter.post("/add-home", hostController.postAddHome);
hostRouter.post("/addContact", homeController.postAddContact);
hostRouter.post("/edit-home", hostController.postEditHome);
hostRouter.post("/delete-home/:id", hostController.postDeleteHome);
hostRouter.delete("/delete-home/:id", hostController.postDeleteHome);

module.exports = hostRouter;
