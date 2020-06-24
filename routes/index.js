var express = require("express");
var router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

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
  updateFirstNameUserProfile,
  updateLastNameUserProfile,
  updatePasswordUserProfile,
  getLocationDetailPage,postComments,updateLikes,acceptLocations,deleteLocations} = require('../controllers/tourismController');

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
Admin user approve the locations
*/
router.get('/approve/:id', acceptLocations);

/*
Admin user reject the locations
*/
 router.get('/reject/:id', deleteLocations); 

/*
Display Register page
*/
router.get('/register', getRegisterPage);

/*
Registration of new user
*/
router.post('/register', submitUserRegistration);


/*
Display login
*/
router.get('/login', getLoginPage);

/*
Validate login
*/
router.post('/login', [verifyLogin, setAuthToken, verifyAuthToken], getValidHome);

/*
Log out user and display login page.
*/
router.get('/logout', verifyAuthToken, unsetAuthToken);
/*
Display Location page
*/
router.get('/newLocation',verifyAuthToken, getLocationPage);
/*
Submit Location page
*/
router.post('/newLocation',upload.single('uploadedfile'),verifyAuthToken, submitLocationPage);

/*
Display search by location name
*/
router.get('/searchLocation', verifyAuthToken, searchLocation);

/*
Display User profile page
*/
router.get('/userprofile/:id', verifyAuthToken, getUserProfile);

/*
Update first name
*/
router.post('/userprofile/edit/firstname', verifyAuthToken, updateFirstNameUserProfile);

/*
Update surname
*/
router.post('/userprofile/edit/lastname', verifyAuthToken, updateLastNameUserProfile);

/*
Update password
*/
router.post('/userprofile/edit/password', verifyAuthToken, updatePasswordUserProfile);

/*
Post comments
*/
router.post('/postComments', verifyAuthToken, postComments);

/*
Display respective Location Page
*/
router.post('/updateLikes',verifyAuthToken, updateLikes);

module.exports = router;

