const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const ApiFeatures = require("../utils/ApiFeatures");
const categoryModel = require("../models/categoryModel");

exports.getCategories = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const countCategories = await categoryModel.countDocuments();
  const { mongooseQuery, pagination } = new ApiFeatures(
    categoryModel.find({ user_id: userId }),
    req.query
  )
    .filter()
    .fields()
    .sort()
    .keyword()
    .pagination(countCategories);

  const categories = await mongooseQuery;
  res.status(200).json({
    results: categories.length,
    paginationResult: pagination,
    data: categories,
  });
});

exports.getCategory = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const category = await categoryModel.findById(req.params.id);
  if (!category) {
    return next(
      new ApiError(`There is no category with this id ${req.params.id}`, 404)
    );
  }
  if (category.user_id.toString() !== userId.toString()) {
    return next(
      new ApiError(`This Document doesn't belong to this user.`, 404)
    );
  }
  res.status(200).json({ status: true, data: category });
});

exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await categoryModel.create({ user_id: req.user.id, name });
  res.status(201).json({ status: true, data: category });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { name } = req.body;
  const category = await categoryModel.findById(req.params.id);
  if (!category) {
    return next(
      new ApiError(`There is no category with this id ${req.params.id}`, 404)
    );
  }
  if (category.user_id.toString() !== userId.toString()) {
    return next(
      new ApiError(`This Document doesn't belong to this user.`, 404)
    );
  }

  category.name = name;
  await category.save();
  res.status(202).json({ status: true, data: category });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const category = await categoryModel.findById(req.params.id);
  if (category.user_id.toString() !== userId.toString()) {
    return next(
      new ApiError(`This Document doesn't belong to this user.`, 404)
    );
  }
  if (!category) {
    return next(
      new ApiError(`There is no category with this id ${req.params.id}`, 404)
    );
  }
  await category.deleteOne();

  res.status(204).send();
});
