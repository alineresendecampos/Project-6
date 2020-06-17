var express = require("express");
var router = express.Router();
let User = require('../models/users');

const { getHomePage,
  getLoginPage,
  verifyLogin,
  getRegisterPage,
  submitUserRegistration,
  getLocationPage,
  submitLocationPage,
  searchLocation,getLocationDetailPage } = require('../controllers/tourismController');

  const {verifyAuthToken,
    setAuthToken,
    unsetAuthToken} = require('../routes/auth');

/* GET home page. */
router.get("/", getHomePage);

/*
Display respective Movie Page
*/
router.get('/location/:id', verifyAuthToken,getLocationDetailPage);

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
router.post('/login',[verifyLogin,setAuthToken], getHomePage);

/*
Log out user and display login page.
*/
router.get('/logout', verifyAuthToken,unsetAuthToken);
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
router.get('/searchLocation',verifyAuthToken, searchLocation);



module.exports = router;
