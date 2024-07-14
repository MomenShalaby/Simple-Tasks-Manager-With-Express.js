const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const ApiFeatures = require("../utils/ApiFeatures");
const taskModel = require("../models/taskModel");
const categoryModel = require("../models/categoryModel");
const taskListModel = require("../models/taskListModel");

exports.getTasks = asyncHandler(async (req, res) => {
  const countTasks = await taskModel.countDocuments();
  const { mongooseQuery, pagination } = new ApiFeatures(
    taskModel.find({ is_shared: true }),
    req.query
  )
    .populate("category_id")
    .filter("nonAuthorized")
    .fields()
    .sort()
    .keyword()
    .pagination(countTasks);

  const tasks = await mongooseQuery;
  for (let task of tasks) {
    if (task.type === "list") {
      const taskListItems = await taskListModel.find({ task_id: task._id });
      task.list = taskListItems; // Add the list items to the task object
    }
  }
  res.status(200).json({
    results: tasks.length,
    paginationResult: pagination,
    data: tasks,
  });
});

exports.getTask = asyncHandler(async (req, res, next) => {
  const task = await taskModel.findById(req.params.id);
  if (!task) {
    return next(
      new ApiError(`There is no task with this id ${req.params.id}`, 404)
    );
  }
  if (req.notAuthenticated && task.is_shared === false) {
    return next(new ApiError(`This Task is private.`, 404));
  }

  if (!req.notAuthenticated) {
    const userId = req.user.id;
    if (
      task.user_id.toString() !== userId.toString() &&
      task.is_shared === false
    ) {
      return next(new ApiError(`This Task is private.`, 404));
    }
  }
  res.status(200).json({ status: true, data: task });
});

exports.createTask = asyncHandler(async (req, res, next) => {
  const user_id = req.user.id;
  const { name, type, body, is_shared, category_id } = req.body;
  const category = await categoryModel.findById(category_id);
  if (!category) {
    return next(
      new ApiError(`There is no category with this id ${category_id}`, 404)
    );
  }
  if (category.user_id.toString() !== user_id.toString()) {
    return next(
      new ApiError(`This Category doesn't belong to this user.`, 404)
    );
  }
  let task;
  if (type === "text") {
    if (!body) {
      return next(
        new ApiError(
          `Add some text in the body if you want to use type Text.`,
          404
        )
      );
    }
    task = await taskModel.create({
      name,
      type: "text",
      body,
      is_shared,
      category_id,
      user_id,
    });
  } else {
    task = await taskModel.create({
      name,
      type: "list",
      is_shared,
      category_id,
      user_id,
    });
  }

  res.status(201).json({ status: true, data: task });
});

exports.updateTask = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { name, body, is_shared, category_id } = req.body;
  const task = await taskModel.findById(req.params.id);
  if (!task) {
    return next(
      new ApiError(`There is no task with this id ${req.params.id}`, 404)
    );
  }
  if (task.user_id._id.toString() !== userId.toString()) {
    return next(new ApiError(`This Task doesn't belong to this user.`, 404));
  }
  if (category_id) {
    const category = await categoryModel.findById(category_id);
    if (!category) {
      return next(
        new ApiError(`There is no category with this id ${category_id}`, 404)
      );
    }
    if (category.user_id.toString() !== user_id.toString()) {
      return next(
        new ApiError(`This Category doesn't belong to this user.`, 404)
      );
    }
    task.category = category;
  }
  if (task.type !== "text" && body) {
    return next(
      new ApiError(`You can't update body field with list type.`, 404)
    );
  }
  task.body = body;
  task.name = name;
  task.is_shared = is_shared;
  await task.save();

  res.status(202).json({ status: true, data: task });
});

exports.deleteTask = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const task = await taskModel.findById(req.params.id);
  if (task.user_id._id.toString() !== userId.toString()) {
    return next(new ApiError(`This Task doesn't belong to this user.`, 404));
  }
  if (!task) {
    return next(
      new ApiError(`There is no task with this id ${req.params.id}`, 404)
    );
  }

  //   delete childrens

  await task.deleteOne();

  res.status(204).send();
});

exports.getUserTasks = asyncHandler(async (req, res) => {
  const user_id = req.user.id;
  const countTasks = await taskModel.countDocuments();
  const { mongooseQuery, pagination } = new ApiFeatures(
    taskModel.find({ user_id: user_id }),
    req.query
  )
    .populate("category_id")
    .filter("nonAuthorized")
    .fields()
    .sort()
    .keyword()
    .pagination(countTasks);

  const tasks = await mongooseQuery;
  for (let task of tasks) {
    if (task.type === "list") {
      const taskListItems = await taskListModel.find({ task_id: task._id });
      task.list = taskListItems; // Add the list items to the task object
    }
  }
  res.status(200).json({
    results: tasks.length,
    paginationResult: pagination,
    data: tasks,
  });
});
