var express = require("express");
var router = express.Router();
let User = require('../models/users');

const { getHomePage,
  getLoginPage,
  verifyLogin,
  getRegisterPage,
  submitUserRegistration } = require('../controllers/tourismController');

/* GET home page. */
router.get("/", getHomePage);

/*
Display Register page
*/
router.get('/register', getRegisterPage);

/*
Submits User details
*/
router.post('/register', submitUserRegistration);


/*
Display Home page
*/
router.get('/login', getLoginPage);

/*
Display TourismHome page
*/
router.post('/login', getHomePage);

/*
Log out user and display login page.
*/
//router.get('/logout', verifyAuthToken,unsetAuthToken);




module.exports = router;
