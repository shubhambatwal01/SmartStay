const mongoose = require("mongoose");
const os = require("os");

const connectDb = (app) => {
  const PORT = process.env.PORT || 3000;
  const HOST = process.env.HOST || "0.0.0.0";

  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Mongoose connected to MongoDB");

      app.listen(PORT, HOST, () => {
        const nets = os.networkInterfaces();
        let localIp = "localhost";

        for (const name of Object.keys(nets)) {
          for (const net of nets[name] || []) {
            if (net.family === "IPv4" && !net.internal) {
              localIp = net.address;
              break;
            }
          }
          if (localIp !== "localhost") break;
        }

        console.log(`Local: http://localhost:${PORT}/`);
        console.log(`LAN:   http://${localIp}:${PORT}/`);
      });
    })
    .catch((err) => {
      console.error("Mongoose connection error:", err);
    });
};

module.exports = connectDb;