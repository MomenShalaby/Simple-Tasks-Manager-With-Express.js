const authRoutes = require("./authRoutes");
const categoryRoutes = require("./categoryRoutes");
const taskRoutes = require("./taskRoutes");
const taskItemRoutes = require("./taskItemRoutes");

const mountRoutes = (app) => {
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/categories", categoryRoutes);
  app.use("/api/v1/tasks", taskRoutes);
  app.use("/api/v1/tasks/items", taskItemRoutes);
};

module.exports = mountRoutes;
