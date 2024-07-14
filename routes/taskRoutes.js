const route = require("express").Router();
const { protect, notAuthenticated } = require("../controllers/authController");
const {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  getUserTasks,
} = require("../controllers/taskController");
const {
  createTaskValidator,
  getTaskValidator,
  updateTaskValidator,
  deleteTaskValidator,
} = require("../utils/validators/taskValidator");

// route.use(protect);
route.route("/").get(getTasks).post(protect, createTaskValidator, createTask);
route.route("/user").get(protect, getUserTasks);
route
  .route("/:id")
  .get(notAuthenticated, protect, getTaskValidator, getTask)
  .put(protect, updateTaskValidator, updateTask)
  .delete(protect, deleteTaskValidator, deleteTask);
module.exports = route;
