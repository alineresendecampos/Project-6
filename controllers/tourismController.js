const crypto = require('crypto');

// Bring in User Model
let User = require('../models/users');
let Location = require('../models/locations');

const tourismController = {
    /*
        Display HomePage Page
        */
    getHomePage: (req, res) => {
        var user_active = true;
        if (req.id == undefined) user_active = false;
        let user_id = req.id
        //A query to retrieve isvalid=true locations from db .

        res.render('home', {
            title: "Locations",
            user_id,
            user_active
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
        var user_active = true;
        if (req.id == undefined) {
            user_active = false;
        }

        // let userID = req.id[0];
        let condition = { _id: req.params.id }
        Location.findById(condition).lean().exec((err, Location) => {
            if (err) {
                console.log("locations" + JSON.stringify(Location));
                console.log(err);
            } else {
                res.render("details", {
                    user_active,
                    name: Location.name,
                    description: Location.description,
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
        //const {rating,ID}= req.body;
        //const {location}=req.body;
        console.log("User searched item:" + `${req.query.locationVal}`);
        const locationquery = { name: `${req.query.locationVal}` };
        console.log("*********Query is*******" + JSON.stringify(locationquery));
        Location.findOne(locationquery, (err, Location) => {
            console.log("locations length" + JSON.stringify(Location));
            if (err) {
                console.log("locations" + JSON.stringify(Location));
                console.log(err);
            } else {
                res.render("partials/homelocations", {
                    layout: false,
                    //locations: Location.Location,
                    objId: Location._id,
                    name: Location.name,
                    description: Location.description,
                    isValidated: Location.isValidated,
                    //locationslength: Location.locations.length > 0
                });
            }
        });
    },


    /*
    Display LocationPage
    */
    getLocationPage: (req, res) => {
        res.render('location');
    },

    /*
    Submit location details to Database
    */
    submitLocationPage: (req, res) => {
        console.log("**Inside submitLocationPage****");
        //const { email, firstName, lastName, password, confirmPassword } = req.body;
        const { locationName, description } = req.body;

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
            let newLocation = new Location({
                name: locationName,
                description: description,
                isValidated: false
            }).save(function (err, doc) {
                if (err) res.json(err);
                else {
                    res.render('home', {
                        message: 'Congrats!Your location has been created successfuly!Please wait for administrator to approve it!',
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
}

module.exports = tourismController;