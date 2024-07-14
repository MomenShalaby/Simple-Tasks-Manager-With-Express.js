const { check, param } = require("express-validator");

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
const typeValidator = [
  check("type")
    .notEmpty()
    .trim()
    .withMessage("type is empty")
    .bail()

    .isIn(["text", "list"])
    .withMessage("type should be one of text, list")
    .bail(),
];
const bodyValidator = [
  check("body").isString().withMessage("body should be a string"),
];

const isSharedValidator = [
  check("is_shared").isBoolean().withMessage("must be a boolean"),
];
const categoryValidator = [
  check("category_id")
    .isMongoId()
    .withMessage("Invalid category_id format.")
    .bail(),
];

const categoryParamValidator = [
  param("category_id")
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage("Invalid category_id format.")
    .notEmpty()
    .withMessage("category_id should not be empty.")
    .bail(),
];

const userParamValidator = [
  param("user_id")
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage("Invalid user_id format.")
    .notEmpty()
    .withMessage("user_id should not be empty.")
    .bail(),
];

const idValidator = [
  check("id").isMongoId().withMessage("Invalid id format.").bail(),
];

exports.getTaskValidator = [idValidator, validatorMiddleware];
exports.createTaskValidator = [
  nameValidator,
  typeValidator,
  // bodyValidator,
  isSharedValidator,
  categoryValidator,
  validatorMiddleware,
];

exports.updateTaskValidator = [validatorMiddleware];
exports.deleteTaskValidator = [idValidator, validatorMiddleware];


