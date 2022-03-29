const router = require("express").Router();
const { body } = require("express-validator");
const login = require("../controllers/user/login");
//controller to handle user registration/signup
const registerUser = require("../controllers/user/register");
const checkValidationResult = require("../utils/checkValidationResult");

//signup or user registration router
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
    .isLength({ min: 8, max: 20 })
    .withMessage("password must be between 8 and 20 characters"),
  //checking the validation results
  checkValidationResult,
  //the controller
  registerUser
);


//login router
router.post('/login', 
  //checking the presence of required data in body
  body("userName").exists()
    .withMessage("userName is required")
    .isAlphanumeric()
    .isLength({ min: 3, max: 20 })
    .withMessage("Invalid username"),
    body("password")
    .exists()
    .withMessage("password is required")
    .isLength({ min: 8, max: 20 })
    .withMessage("Invalid password"),
    //checking the validation results
  checkValidationResult,
  //the controller
  login
)

module.exports = router;
