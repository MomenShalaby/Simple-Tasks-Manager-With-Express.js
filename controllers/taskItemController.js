const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const taskItemModel = require("../models/taskListModel");
const taskModel = require("../models/taskModel");

exports.getTaskItem = asyncHandler(async (req, res, next) => {
  const taskItem = await taskItemModel.findById(req.params.id);
  if (!taskItem) {
    return next(
      new ApiError(`There is no task with this id ${req.params.id}`, 404)
    );
  }
  const task = await taskModel.findById(taskItem.task_id);
  if (!task) {
    return next(
      new ApiError(`There is no task with this id ${taskItem.task_id}`, 404)
    );
  }
  const user_id = req.user.id;
  if (task.user_id.toString() !== user_id.toString()) {
    return next(new ApiError(`This Task doesn't belong to this user.`, 404));
  }

  res.status(200).json({ status: true, data: taskItem });
});

exports.createTaskItem = asyncHandler(async (req, res, next) => {
  const user_id = req.user.id;
  const { body, task_id } = req.body;
  const task = await taskModel.findById(task_id);
  if (!task) {
    return next(new ApiError(`There is no task with this id ${task_id}`, 404));
  }
  if (task.user_id.toString() !== user_id.toString()) {
    return next(new ApiError(`This Task doesn't belong to this user.`, 404));
  }
  if (task.type !== "list") {
    return next(new ApiError(`This Task is of type list.`, 404));
  }
  const taskItem = await taskItemModel.create({
    body,
    task_id,
  });

  res.status(201).json({ status: true, data: taskItem });
});

exports.updateTaskItem = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { body } = req.body;
  const taskItem = await taskItemModel.findById(req.params.id);
  if (!taskItem) {
    return next(
      new ApiError(`There is no task item with this id ${req.params.id}`, 404)
    );
  }
  const task = await taskModel.findById(taskItem.task_id);
  if (!task) {
    return next(
      new ApiError(`There is no task with this id ${taskItem.task_id}`, 404)
    );
  }  if (task.user_id._id.toString() !== userId.toString()) {
    return next(
      new ApiError(`This Task item doesn't belong to this user.`, 404)
    );
  }

  taskItem.body = body;
  await taskItem.save();

  res.status(202).json({ status: true, data: taskItem });
});

exports.deleteTaskItem = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const taskItem = await taskItemModel.findById(req.params.id);
  if (!taskItem) {
    return next(
      new ApiError(`There is no task with this id ${req.params.id}`, 404)
    );
  }
  const task = await taskModel.findById(taskItem.task_id);
  if (!task) {
    return next(
      new ApiError(`There is no task with this id ${taskItem.task_id}`, 404)
    );
  }  if (task.user_id._id.toString() !== userId.toString()) {
    return next(
      new ApiError(`This Task item doesn't belong to this user.`, 404)
    );
  }

  await taskItem.deleteOne();

  res.status(204).send();
});
