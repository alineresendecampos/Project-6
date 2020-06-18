var express = require("express");
var router = express.Router();
let User = require('../models/users');

const { getHomePage,
  getLoginPage,
  verifyLogin,
  getRegisterPage,
  submitUserRegistration,
  getLocationPage,
  getValidHome,
  submitLocationPage,
  searchLocation,
  getUserProfile,
  getLocationDetailPage } = require('../controllers/tourismController');

const { verifyAuthToken,
  setAuthToken,
  unsetAuthToken } = require('../routes/auth');

/* GET home page. */
router.get("/", verifyAuthToken, getHomePage);

/*
Display respective Location Page
*/
router.get('/location/:id', verifyAuthToken, getLocationDetailPage);

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
router.post('/login', [verifyLogin, setAuthToken, verifyAuthToken], getValidHome);

/*
Log out user and display login page.
*/
router.get('/logout', verifyAuthToken, unsetAuthToken);
/*
Display Location page
*/
router.get('/newLocation', getLocationPage);
/*
Submit Location page
*/
router.post('/newLocation', submitLocationPage);

/*
Display search by location name
*/
router.get('/searchLocation', verifyAuthToken, searchLocation);

/*
Display User profile page
*/
router.get('/userprofile/:id', verifyAuthToken, getUserProfile);

module.exports = router;

