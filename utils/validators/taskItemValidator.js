const { check, param } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const bodyValidator = [
  check("body").isString().withMessage("body should be a string"),
];

const idValidator = [
  check("id").isMongoId().withMessage("Invalid id format.").bail(),
];
const taskIdValidator = [
  check("task_id").isMongoId().withMessage("Invalid id format.").bail(),
];

exports.getTaskValidator = [idValidator, validatorMiddleware];
exports.createTaskValidator = [
  bodyValidator,
  taskIdValidator,
  validatorMiddleware,
];

exports.updateTaskValidator = [bodyValidator, idValidator, validatorMiddleware];
exports.deleteTaskValidator = [idValidator, validatorMiddleware];
