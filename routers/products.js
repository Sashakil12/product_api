const router = require("express").Router();
const { query, body, param } = require("express-validator");
const getAll = require("../controllers/products/getAll");
const getAllForAuthenticatedUser = require("../controllers/products/getAllForAuthenticatedUser");
const checkValidationResult = require("../utils/checkValidationResult");
const auth = require("../utils/auth");
const add = require("../controllers/products/add");
const update = require("../controllers/products/update");
const deleteProduct = require("../controllers/products/delete");
const deleteProductMany = require("../controllers/products/deleteMany");
const mongoose = require("mongoose");
//public product route
router.get(
  "/",
  //validating query params
  query("limit")
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage("limit is required")
    .isInt({ min: 0, max: 250 })
    .withMessage(
      "invalid parameter 'limit' must be a number between 0 and 250"
    ),
  query("skip")
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage("skip is required")
    .isInt({ min: 0 })
    .withMessage("invalid parameter 'skip' must be a number greater than 0"),
  //check validation errors,
  checkValidationResult,
  //controller
  getAll
);

//authenticated product research
router.get(
  "/all",
  //checking auth
  auth,
  //validating query params
  query("limit")
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage("limit is required")
    .isInt({ min: 0, max: 250 })
    .withMessage(
      "invalid parameter 'limit' must be a number between 0 and 250"
    ),
  query("skip")
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage("skip is required")
    .isInt({ min: 0 })
    .withMessage("invalid parameter 'skip' must be a number greater than 0"),
  //check validation errors,
  checkValidationResult,
  //controller
  getAllForAuthenticatedUser
);

//add product route
router.post(
  "/add",
  //checking authentication
  auth,
  //checking body for required data,
  body("name")
    .trim()
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage("name is required")
    .isString()
    .withMessage("name must be a string")
    // .length({ min: 1, max: 100 })
    .withMessage("name must be between 1 and 50 characters"),
  body("categoryId")
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage("categoryId is required")
    .isNumeric()
    .withMessage("categoryId must be a number")
    .toInt({ min: 1 }),
  body("categoryName")
    .trim()
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage("categoryName is required")
    .isString()
    .withMessage("categoryName must be a string")
    // .length({ min: 1, max: 50 })
    .withMessage("categoryName must be between 1 and 50 characters"),
  body("unitPrice")
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage("unitPrice is required")
    .isNumeric()
    .withMessage("unitPrice must be a number")
    .toFloat({ min: 0 })
    .withMessage("unitPrice must be between 1 and 50 characters"),
  body("status")
    .trim()
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage("status is required")
    .isIn(["available", "discontinued"])
    .withMessage("status must be 'available' or 'discontinued'"),
  //checking validation result
  checkValidationResult,
  //controller
  add
);

//update product route
router.patch(
  "/:id",
  //checking authentication
  auth,
  //checking body for required data,
  param("id").isMongoId().withMessage("invalid product id"),
  body("name")
    .trim()
    .isString()
    .withMessage("name must be a string")
    // .length({ min: 1, max: 100 })
    .withMessage("name must be between 1 and 50 characters"),
  body("categoryId")
    .isNumeric()
    .withMessage("categoryId must be a number")
    .toInt({ min: 1 }),
  body("categoryName")
    .trim()
    .isString()
    .withMessage("categoryName must be a string")
    // .length({ min: 1, max: 50 })
    .withMessage("categoryName must be between 1 and 50 characters"),
  body("unitPrice")
    .isNumeric()
    .withMessage("unitPrice must be a number")
    .toFloat({ min: 0 })
    .withMessage("unitPrice must be between 1 and 50 characters"),
  body("status")
    .trim()
    .isIn(["available", "discontinued"])
    .withMessage("status must be 'available' or 'discontinued'"),
  //checking validation result
  checkValidationResult,
  //controller
  update
);
//delete many product route
router.delete(
  "/multiple",
  //checking authentication
  auth,
  //checking body for required data,
  body("ids").isArray({min:1}).withMessage("at least one id is required").custom((arr)=>{
    let isValid = true;
    arr.forEach(id=>{
      if(!mongoose.Types.ObjectId.isValid(id)){
        isValid = false;
      }
    })
    return isValid;

  }),
  //checking validation result
  checkValidationResult,
  //controller
  deleteProductMany
);

//delete product route
router.delete(
  "/:id",
  //checking authentication
  auth,
  //checking body for required data,
  param("id").isMongoId().withMessage("invalid product id"),
  //checking validation result
  checkValidationResult,
  //controller
  deleteProduct
);


module.exports = router;
