const tourismController = {
    /*
        Display HomePage Page
        */
       getHomePage: (req, res) => {
            res.render('home', { 
                 title: "Locations"
            });
        },
        /*
        Display Register Form
        */
       getRegisterPage: (req, res) => {
        res.render('registration');
        },
    
        /*
        Register User details
        */
       submitUserRegistration:(req, res) => {
        const { email, firstName,lastName, password, confirmPassword } = req.body;
       //Validations for User account
       const emailPattern="^[a-zA-Z0-9.!#$%£&'*+/=?^_`{|}~-]+@[a-zA-Z]+(\.)+([a-zA-Z]+)*$";
       const namePattern="^[a-zA-Z][a-zA-Z ]+[a-zA-Z]+$";
       const passwordPattern="^[A-Za-z0-9].{6,}"
    
       console.log("Firstname "+firstName);
       console.log("Lastname "+lastName);
       console.log("Email "+email);
       console.log("password "+password);
         if(!firstName.match(namePattern))
        {
            res.render('register', {
                message: 'Please enter Valid firstName',
                messageClass: 'alert-danger'
            });
    
        }else if(!lastName.match(namePattern)){
            res.render('register', {
                message: 'Please enter Valid lastname',
                messageClass: 'alert-danger'
            });
    
        }else if(!email.match(emailPattern))
        {
            res.render('register', {
                message: 'Please enter Valid Email',
                messageClass: 'alert-danger'
            });
    
        }else if(!password.match(passwordPattern))
        {
            res.render('register', {
                message: 'Password must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters!',
                messageClass: 'alert-danger'
            });
    
        }else{
            //Check if password and conform password matches
            if (password === confirmPassword) {
                // Check if user with the same email is also registered
                validateUserEmail([email],(result) =>{
                    console.log("result:"+result);
                    if (result > '0'){
                        res.render('register', {
                            message: 'User already registered.',
                            messageClass: 'alert-danger'
                        });
                    }
                    else{
                        const hashedPassword = getHashedPassword(password);
                        // Store user into the database
                        createUser([lastName,firstName,email,hashedPassword],(result)=> {
                            console.log("After inserting no of Rows inserted into table successfully is : " +result.affectedRows);
                            res.render('login', {
                                message: 'Registration Complete. Please login to continue.',
                                messageClass: 'alert-success'
                            });
                        });
                    }
                });
            }else {
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
       getLoginPage:(req, res) => {
        res.render('login');
    },
    
    }
    module.exports=tourismController;