const router = require('express').Router();
//controller to handle user registration/signup
const registerUser = require("../controllers/user/register");
router.post('/user/register', registerUser)


module.exports = router