const path = require("path"); // Core Module

module.exports = path.dirname(require.main.filename);
// This will give the directory name of the main module, which is typically the root directory of your application.
