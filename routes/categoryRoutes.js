const route = require("express").Router();
const { protect } = require("../controllers/authController");
const { 
  getCategories,
  createCategory,
  updateCategory,
  getCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const {
  createCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

route.use(protect)
route
  .route("/")
  .get(getCategories)
  .post(createCategoryValidator, createCategory);
route
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);
module.exports = route;
