const route = require("express").Router();
const { protect } = require("../controllers/authController");
const {
  getTaskItem,
  updateTaskItem,
  deleteTaskItem,
  createTaskItem,
} = require("../controllers/taskItemController");
const {
  createTaskValidator,
  getTaskValidator,
  updateTaskValidator,
  deleteTaskValidator,
} = require("../utils/validators/taskItemValidator");

// route.use(protect);
route.route("/").post(protect, createTaskValidator, createTaskItem);
route
  .route("/:id")
  .get(protect, getTaskValidator, getTaskItem)
  .put(protect, updateTaskValidator, updateTaskItem)
  .delete(protect, deleteTaskValidator, deleteTaskItem);
module.exports = route;
