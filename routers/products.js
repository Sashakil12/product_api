const router = require("express").Router();
const { query } = require("express-validator");
const getAll = require("../controllers/products/getAll");
const getAllForAuthenticatedUser = require("../controllers/products/getAllForAuthenticatedUser");
const checkValidationResult = require("../utils/checkValidationResult");
const auth = require("../utils/auth");
//public product route
router.get(
  "/",
  //validating query params
  query("limit")
    .exists({checkFalsy:true, checkNull:true})
    .withMessage("limit is required")
    .isInt({ min: 0, max: 250 })
    .withMessage(
      "invalid parameter 'limit' must be a number between 0 and 250"
    ),
  query("skip")
    .exists({checkFalsy:true, checkNull:true})
    .withMessage("skip is required")
    .isInt({ min: 0}).withMessage("invalid parameter 'skip' must be a number greater than 0"),
  //check validation errors,
  checkValidationResult,
  //controller
  getAll
);

//authenticated product research
router.get(
  "/all",
  //validating query params
  query("limit")
    .exists({checkFalsy:true, checkNull:true})
    .withMessage("limit is required")
    .isInt({ min: 0, max: 250 })
    .withMessage(
      "invalid parameter 'limit' must be a number between 0 and 250"
    ),
  query("skip")
    .exists({checkFalsy:true, checkNull:true})
    .withMessage("skip is required")
    .isInt({ min: 0}).withMessage("invalid parameter 'skip' must be a number greater than 0"),
  //check validation errors,
  checkValidationResult,
  //checking auth
  auth,
  //controller
  getAllForAuthenticatedUser
);

module.exports = router;
