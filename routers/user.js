const router = require('express').Router();
//controller to handle user registration/signup
const registerUser = require("../controllers/user/register");
router.post('/register', registerUser)


module.exports = router