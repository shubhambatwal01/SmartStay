exports.isLoggedIn = (req, res, next) => {
  if (!req.session.isLoggedIn || !req.session.user) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated. Please login first.",
    });
  }
  next();
};

// Error handling middleware
exports.handleAsyncErrors = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
