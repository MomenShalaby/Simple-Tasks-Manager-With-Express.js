const { check } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const nameValidator = [
  check("name")
    .notEmpty()
    .trim()
    .withMessage("Name is empty")
    .bail()

    .isLength({ min: 2 })
    .withMessage("Name is too short")
    .bail()

    .isLength({ max: 20 })
    .withMessage("Name is too long")
    .bail()

    .not()
    .isNumeric()
    .withMessage("include at least one character")
    .bail()

    .matches(/^[A-Za-z0-9 .,'!&]+$/)
    .withMessage("not allowed characters")
    .bail(),
];

const idValidator = [
  check("id").isMongoId().withMessage("Invalid id format.").bail(),
];

exports.getCategoryValidator = [idValidator, validatorMiddleware];
exports.createCategoryValidator = [nameValidator, validatorMiddleware];
exports.updateCategoryValidator = [nameValidator, validatorMiddleware];
exports.deleteCategoryValidator = [idValidator, validatorMiddleware];
