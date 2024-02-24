// Third snippet
const express = require("express");
const {
  login,
  registerUser,
  fetchAllUsersController,
  
} = require("../Controllers/auth");

const  protect  = require("../Middlewares/authMiddleware");

const Router = express.Router();

Router.post("/login", login);
Router.post("/register", registerUser);
Router.get("/fetchUsers", protect, fetchAllUsersController);
module.exports = Router;
