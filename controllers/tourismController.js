const crypto = require('crypto');
const fs = require('fs');

// Bring in User Model
let User = require('../models/users');
let Location = require('../models/locations');

const tourismController = {
    /*
       Display HomePage Page
    */
    getHomePage: async(req, res) => {
        console.log("***********Inside getHomepage method");
        var user_active = true;
        let user_id = req.id;
        let user_admin = true;
        if (req.id == undefined) {
            user_active = false;
            Location.find({ isValidated: true}).lean().exec(function(err,Location) {
                var locationsMap = {};
                Location.forEach(function(location) {
                    console.log("ITEMS are:"+location)
                    locationsMap[location._id] = location;
                });
               console.log("!!!!!!!!!!!!!"+user_admin+ JSON.stringify(locationsMap));
               const LocationsSize = Object.keys(locationsMap).length;
               res.render('home', {
                    user_id,
                    user_active,
                    user_admin,                
                    locationsMap,
                    locationsLength :LocationsSize>0
                });
                    
              }); 
        }else{
            let toCheckUser = {_id:req.id};
            //check if the logged in user is admin or not.
            User.findOne(toCheckUser,{isAdmin:1,_id:0},(err,User)=>{
                if(User.isAdmin){
                    //if admin user display all isvalidated:false locations
                    user_admin = true;
                    Location.find({ isValidated: false}).lean().exec(function(err,Location) {
                        var locationsMap = {};
                        Location.forEach(function(location) {
                            console.log("ITEMS are:"+location)
                            locationsMap[location._id] = location;
                        });
                       console.log("!!!!!!!!!!!!!"+user_admin+ JSON.stringify(locationsMap));
                       const LocationsSize = Object.keys(locationsMap).length;
                        res.render('home', {
                            user_id,
                            user_active,
                            user_admin,                
                            locationsMap,
                            locationsLength :LocationsSize>0
                        });
                            
                      });
                }else{
                    //else display all isvalidated:true Locations
                    user_admin = false;
                    Location.find({ isValidated: true}).lean().exec(function(err,Location) {
                        var locationsMap = {};
                        Location.forEach(function(location) {
                            console.log("ITEMS are:"+location)
                            locationsMap[location._id] = location;
                        });
                       console.log("!!!!!!!!!!!!!"+user_admin+ JSON.stringify(locationsMap));
                       const LocationsSize = Object.keys(locationsMap).length;
                        res.render('home', {
                            user_id,
                            user_active,
                            user_admin,                
                            locationsMap,
                            locationsLength :LocationsSize>0
                        });
                      });
                }
            });
        }
    },

    /*
        To validate the new locations
     */
    acceptLocations: (req, res) => {
        console.log("***********Inside acceptLocations method");
        let idToValidate = { _id: req.params.id };
        let updateField = {isValidated : true}
        Location.update(idToValidate,updateField,(err,results)=>{
            if(err){
                console.log(err);
                return;
            }else{
                res.redirect('/');
            }
        });
    },
    /*
        To delete the new locations
     */
    deleteLocations: (req, res) => {
        console.log("***********Inside deleteLocations method");
        let idToValidate = { _id: req.params.id };
        Location.deleteOne(idToValidate,(err,results)=>{
            if(err){
                console.log(err);
                return;
            }else{
                res.redirect('/');
            }
        });
    },
    
    /*
    Validate homepage
    */
    getValidHome: (req, res) => {
        res.redirect("/");
    },

    /*
    Display Register Form
    */
    getRegisterPage: (req, res) => {
        res.render('register');
    },
    /*
    Display Locations Details Page
    */
   getLocationDetailPage: (req, res) => {
    console.log("***req.id"+req.id)
    var user_active = true;
    var commentsValue = false;
    var commentsFromDB,postedbyIDFromDB = ''; 
    let userFirstName,userLastName = '';
    if (req.id == undefined) {
        user_active = false;
    } 
        let userID = req.id;
        let condition = { _id: req.params.id };
        Location.findOne(condition,{comments:1,_id:0},(err,Location)=>{
            if(Location.comments == undefined){
               commentsValue=false;
            }else{
                commentsValue=true;
                if(JSON.stringify(Location.comments[0]) !=undefined){
                    commentsFromDB=Location.comments[0].text;
                    postedbyIDFromDB=Location.comments[0].postedBy;
                    const useridvalue = {_id: postedbyIDFromDB} ;
                    User.findOne(useridvalue,{firstName:1,lastName:1},(err,User)=>{
                        userFirstName = User.firstName;
                        userLastName=User.lastName;
                        console.log("**********"+userFirstName+userLastName);
                    });  
                }
               
            }
        });
        Location.findById(condition).lean().exec((err, Location) => {
            if (err) {
                console.log(err);
            } else {
                console.log("**********222"+userFirstName+userLastName)
                res.render("details", {
                    user_active,
                    commentsValue,
                    commentsFromDB,userFirstName,userLastName,postedbyIDFromDB,
                    objId: Location._id,
                    name: Location.name,
                    description: Location.description,
                    likes:Location.likes,
                    locationImage:Location.locationImage
                });
            }
        });
    },

    /*
    Register User details
    */
    submitUserRegistration: (req, res) => {
        const { email, firstName, lastName, password, confirmPassword } = req.body;
        //Validations for User account
        const emailPattern = "^[a-zA-Z0-9.!#$%£&'*+/=?^_`{|}~-]+@[a-zA-Z]+(\.)+([a-zA-Z]+)*$";
        const namePattern = "^[a-zA-Z][a-zA-Z ]+[a-zA-Z]+$";
        const passwordPattern = "^[A-Za-z0-9].{6,}"

        console.log("Firstname " + firstName);
        console.log("Lastname " + lastName);
        console.log("Email " + email);
        console.log("password " + password);
        if (!firstName.match(namePattern)) {
            res.render('register', {
                message: 'Please enter Valid firstName',
                messageClass: 'alert-danger'
            });

        } else if (!lastName.match(namePattern)) {
            res.render('register', {
                message: 'Please enter Valid lastname',
                messageClass: 'alert-danger'
            });

        } else if (!email.match(emailPattern)) {
            res.render('register', {
                message: 'Please enter Valid Email',
                messageClass: 'alert-danger'
            });

        } else if (!password.match(passwordPattern)) {
            res.render('register', {
                message: 'Password must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters!',
                messageClass: 'alert-danger'
            });

        } else {
            //Check if password and conform password matches
            if (password === confirmPassword) {
                const sha256 = crypto.createHash('sha256');
                const hashedPassword = sha256.update(password).digest('base64');
                let newUser = new User({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: hashedPassword
                });
                newUser.save(function (err) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        res.render('login', {
                            message: 'Registration Complete. Please login to continue.',
                            messageClass: 'alert-success'
                        });
                    }
                });
            } else {
                res.render('register', {
                    message: 'Password does not match.',
                    messageClass: 'alert-danger'
                });
            }
        }
    },
    /*
    Display Login Page
    */
    getLoginPage: (req, res) => {
        res.render('login');
    },
    /*
       Verify login
   */
    verifyLogin: (req, res, next) => {
        const { email, password } = req.body;
        const sha256 = crypto.createHash('sha256');
        const hashedPassword = sha256.update(password).digest('base64');
        console.log("Email and pwd :" + email + " " + password)
        const queryEmail = { email: email };
        User.findOne(queryEmail, (err, user) => {
            if (!user) {
                console.log("Account doesnot exists" + user)
                res.render('login', {
                    message: 'Account doesnot exist!!Please register your account.',
                    messageClass: 'alert-danger'
                });
            } else {
                console.log("Account exists" + JSON.stringify(user))
                if (hashedPassword == user.password) {
                    res.status('200');
                    console.log("********VALID USER" + user._id)
                    req.userID = user._id;
                    next();
                } else {
                    res.render('login', {
                        message: 'Password Mismatch!Please enter valid password.',
                        messageClass: 'alert-danger'
                    });
                }
            }
        });
    },
    /*
    Search the Location by name
    */
    searchLocation: (req, res) => {
        console.log("User searched item:" + `${req.query.locationVal}`);
        const locationquery = { name: `${req.query.locationVal}` };
        Location.find(locationquery).lean().exec(function(err,Location) {
            if (err) {
                console.log("locations" + JSON.stringify(Location));
                console.log(err);
            } else {
                var locationsMap = {};
                Location.forEach(function(location) {
                    console.log("ITEMS are:"+location)
                    locationsMap[location._id] = location;
                });
                const LocationsSize = Object.keys(locationsMap).length;
                res.render("partials/homelocations", {
                    layout: false,
                    locationsMap,
                    locationsLength :LocationsSize>0
                });
            }
        });
    },

    /*
    Display LocationPage
    */
    getLocationPage: (req, res) => {
        var user_active = true;
        if (req.id == undefined) {
            user_active = false;
        }
        res.render('location',{
            user_active
        });
    },

    /*
    Submit location details to Database
    */
    submitLocationPage: (req, res) => {
        console.log("**Inside submitLocationPage****");
        var user_active = true;
        if (req.id == undefined) {
            user_active = false;
        }
        const { locationName, description } = req.body;
        var imageData = fs.readFileSync(req.file.path)
        let bufferImage = new Buffer(imageData.toString('base64'), 'base64');
        const pattern = "^[a-zA-Z][a-zA-Z ]+[a-zA-Z ]+$";
        const descriptionpattern = "^[a-zA-Z][a-zA-Z. ]+[a-zA-Z. ]+$";
        console.log("Location name and description:" + locationName + description)
        if (!locationName.match(pattern)) {
            res.render('location', {
                message: 'Please enter Valid location name',
                messageClass: 'alert-danger'
            });
        } else if (!description.match(descriptionpattern)) {
            res.render('location', {
                message: 'Please enter Valid description',
                messageClass: 'alert-danger'
            });
        } else {
           let locationimagdata= { data: bufferImage,
             contentType:req.file.mimetype
            }
            let newLocation = new Location({
                name: locationName,
                description: description,
                locationImage:locationimagdata,
                isValidated: false
            }).save(function (err, doc) {
                if (err) res.json(err);
                else {
                    res.render('location',{
                        message: 'Thank you for upload!You location will be displayed once the administrator approves it!',
                        messageClass: 'alert-success'
                    });
                }
            });
        }
    },

    /*
    Display user profile details
    */
    getUserProfile: (req, res) => {
        var user_active = true;
        if (req.id == undefined) {
            user_active = false;
        }
        //let userID = req.id[0];
        let condition = { _id: req.params.id }
        User.findById(condition).lean().exec((err, User) => {
            //User.findOne(, function (err, User) {
            if (err) {
                console.log("User profile" + JSON.stringify(User));
                console.log(err)
            } else {
                res.render('userprofile', {
                    user_active,
                    firstName: User.firstName,
                    lastName: User.lastName,
                    email: User.email,
                });
            }
        });
    },

    /*
    Update first name of user.
    */
    updateFirstNameUserProfile: (req, res) => {
        console.log("inside function update fn")
        var user_active = true;
        if (req.id == undefined) {
            user_active = false;
        }
        const { firstName } = req.body;
        const userId = req.id;
        const firstNameVal = { firstName: firstName };
        const userObjId = { _id: userId };
        console.log(firstNameVal)
        console.log(userObjId)
        User.updateOne(userObjId, firstNameVal, (err, result) => {
            if (err) {
                console.log(err)
                return
            } else {
                console.log("value of " + JSON.stringify(result))
                User.findOne(userObjId, (err, userData) => {
                    res.render('userprofile', {
                        user_active,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        email: userData.email,
                        message: "Your name was updated successfuly!",
                        messageClass: "alert-success"
                    });
                })
            };
        })
    },

    /*
    Update Last name of user.
    */
    updateLastNameUserProfile: (req, res) => {
        console.log("inside function ln")
        var user_active = true;
        if (req.id == undefined) {
            user_active = false;
        }
        const { lastName } = req.body;
        const userId = req.id;
        const lastNameVal = { lastName: lastName };
        const userObjId = { _id: userId };
        console.log(lastNameVal)
        console.log(userObjId)
        User.updateOne(userObjId, lastNameVal, (err, result) => {
            if (err) {
                console.log(err)
                return
            } else {
                console.log("value of " + JSON.stringify(result))
                User.findOne(userObjId, (err, userData) => {
                    res.render('userprofile', {
                        user_active,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        email: userData.email,
                        message: "Your name was updated successfuly!",
                        messageClass: "alert-success"
                    });
                })
            };
        })
    },
    /*
        Update password of user.
    */
    updatePasswordUserProfile: (req, res) => {
        console.log("inside function pwd")
        var user_active = true;
        if (req.id == undefined) {
            user_active = false;
        }
        const { password } = req.body;
        const { confirmPassword } = req.body;
        let hashedPassword = "";
        if (password === confirmPassword) {
            const sha256 = crypto.createHash("sha256");
            hashedPassword = sha256.update(password).digest("base64");
        } else {
            res.render("userprofile", {
                message: "Password does not match.",
                messageClass: "alert-danger",
            });
        }
        const userId = req.id;
        const passwordVal = { password: hashedPassword };
        const userObjId = { _id: userId };
        console.log(passwordVal)
        console.log(userObjId)
        User.updateOne(userObjId, passwordVal, (err, result) => {
            if (err) {
                console.log(err)
                return
            } else {
                console.log("value of " + JSON.stringify(result))
                User.findOne(userObjId, (err, userData) => {
                    res.render('userprofile', {
                        user_active,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        email: userData.email,
                        message: "Your name was updated successfuly!",
                        messageClass: "alert-success"
                    });
                })
            };
        })
    },

    /*
    Update user comments into database.
    */
    postComments: (req, res) => {
        console.log("********Inside postComments***********");
        const {commentsVal,locationId}= req.body;
        const activeuserid= req.id;
        console.log("User Comments" + commentsVal);
        console.log("locationId" + locationId);
        const userObjId= { _id: activeuserid };
        let userCommentsArray = [];
        const userComments ={ text: commentsVal,postedBy:userObjId  } ;
        userCommentsArray.push(userComments);
        const commentstostore ={comments: userCommentsArray};
        const locationObjId= { _id: locationId };
        console.log("*********User comments in object is*******" + JSON.stringify(commentstostore));
        console.log("*********Location id  is*******" + JSON.stringify(locationObjId));
        Location.update(locationObjId,commentstostore,(err,results)=>{
            if(err){
                console.log(err);
                return;
            }else{
            Location.find({})
            .populate('postedBy')
            .populate('comments.postedBy')
            .lean().exec(function(error, Location) {
                console.log(JSON.stringify(Location))
                res.send(Location);
            })
               
            }
        });
    },
    /*
    Update user likes into database.
    */
    updateLikes: (req, res) => {
        console.log("********Inside updateLikes***********");
        const {locationId}= req.body;
        // const activeuserid= req.id[0];
        console.log("locationId" + locationId);
        const locationObjId = { _id: locationId };
        const update = { $inc: { likes: 1 } };
        console.log("*********Location id  is*******" + JSON.stringify(locationObjId));
        Location.update(locationObjId,update,(err,results)=>{
            if(err){
                console.log(err);
                return;
            }else{
                res.send(results);
            }
        });
    },
}
module.exports = tourismController;