const { check } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const nameValidator = [
  check("name")
    .notEmpty()
    .trim()
    .withMessage("Name is empty")
    .bail() // Add bail() here

    .isLength({ min: 2 })
    .withMessage("Name is too short")
    .bail() // Add bail() here

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

const emailValidator = [
  check("email")
    .notEmpty()
    .trim()
    .withMessage("Email is empty")
    .bail() // Add bail() here

    .isEmail()
    .withMessage("Invalid email format")
    .bail(), // Add bail() here
];

const passwordValidator = [
  check("password")
    .notEmpty()
    .trim()
    .withMessage("Password is empty")
    .bail() // Add bail() here

    .isLength({ min: 8 })
    .withMessage("Password is too short")
    .bail() // Add bail() here

    .isLength({ max: 32 })
    .withMessage("Password is too long")
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

exports.createUserValidator = [
  nameValidator,
  emailValidator,
  passwordValidator,
  validatorMiddleware,
];

exports.loginValidator = [
  emailValidator,
  check("password").notEmpty().trim().withMessage("password is empty"),
  validatorMiddleware,
];

exports.getUserValidator = [idValidator, validatorMiddleware];
