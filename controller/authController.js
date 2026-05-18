exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    currentPage: "Login",
    isLoggedIn: false,
  });
};

exports.postLogin = (req, res, next) => {
  console.log(req.body);
  req.session.isLoggedIn = true;
  const name = req.body.Name;
  const email = req.body.Email;
  const password = req.body.Password;

  const hardcodedName = "Shubz";
  const hardcodedEmail = "shubhambatwal14@gmail.com";
  const hardcodedPassword = "1234";

  if (
    name === hardcodedName &&
    email === hardcodedEmail &&
    password === hardcodedPassword
  ) {
    // Successful login
    res.redirect("/homes");
  } else {
    req.session.isLoggedIn = false;
    // Failed login
    res.render("auth/login", {
      pageTitle: "Login",
      currentPage: "Login",
      errorMessage: "Invalid email or password.",
      isLoggedIn: false,
    });
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    currentPage: "Signup",
    isLoggedIn: false,
  });
}