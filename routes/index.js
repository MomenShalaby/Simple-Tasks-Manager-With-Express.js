const authRoutes = require("./authRoutes");

const mountRoutes = (app) => {
  app.use("/api/v1/auth", authRoutes);
};

module.exports = mountRoutes;