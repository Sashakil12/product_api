const router = require("express").Router();
const { body } = require("express-validator");
//controller to handle user registration/signup
const registerUser = require("../controllers/user/register");
const checkValidationResult = require("../utils/checkValidationResult");

router.post(
  "/register",
  //checking the presence of required data in body
  body("userName")
    .exists()
    .withMessage("userName is required")
    .isAlphanumeric()
    .isLength({ min: 3, max: 20 })
    .withMessage("userName must be between 3 and 20 characters"),
  body("password")
    .exists()
    .withMessage("password is required")
    .isAlphanumeric()
    .isLength({ min: 8, max: 20 })
    .withMessage("password must be between 8 and 20 characters"),
  //checking the validation results
  checkValidationResult,
  //the controller
  registerUser
);

module.exports = router;
