const route = require("express").Router();
const {
  createUserValidator,
  loginValidator,
} = require("../utils/validators/userValidator");

const { signUp, logIn } = require("../controllers/authController");

route.post("/signup", createUserValidator,signUp);
route.post("/login", loginValidator,logIn);

module.exports = route;
