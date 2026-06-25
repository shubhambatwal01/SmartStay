exports.get404 = (req, res, next) => {
  res.status(404).json("404", {
    pageTitle: "Page Not Found",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  }); //page not found
};
