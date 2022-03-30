const router = require("express").Router();
const { query } = require("express-validator");
const getAll = require("../controllers/products/getAll");
const checkValidationResult = require("../utils/checkValidationResult");

//public product route
router.get(
  "/",
  //validating query params
  query("limit")
    .exists()
    .withMessage("limit is required")
    .toInt()
    .withMessage("invalid parameter 'limit'"),
    query("skip")
    .exists()
    .withMessage("skip is required")
    .toInt()
    .withMessage("invalid parameter 'skip'"),
    //check validation errors,
    checkValidationResult,
    //controller
  getAll
);

module.exports = router;
