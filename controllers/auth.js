const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createJWT,} = require("../utils/auth");

// SIGN UP LOGIC: Check if the user exists or not, if the user already exists, throw errors with the message email already exists.
// If the user is a new user, use bcrypt to hash the password before storing it in your database
// Save data(name, email, and password) in MongoDB.

// SIGN IN LOGIC: Check if the user exists or not, if user not exists, throw errors with the message user not found.
// If the user exists, we are checking whether the assigned and retrieved passwords are the same or not using the bcrypt.compare() method.
// Sign our jwt and set the JWT token expiration time. Token will be expired within the defined duration which is 1hr in our current code.
// If succeed send the token in our response with success status(200) and user information.


// auth route for signing up 
exports.signup = (req, res, next ) => {
    // destructure body signup body POST request
    let { name, email, password, passwordConfirmation } = req.body;
    // if email already exist respond with error message otherwise
    // and new user to user using the User shema 
    User.findOne({email: email})
        .then(user => {
            if(user){
                return res.status(422).json({ errors: [{ user: "email already exists" }] });
            }else{
                // putting new user info into User model
                const user = new User({
                    name: name,
                    email: email,
                    password: password,
                });
                // Generate a salt and hash on seperate function calls
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(password, salt, function(err, hash) {
                        //// Store the "hashed" password in your password DB.
                        if (err) throw err;
                        user.password = hash;
                        user.save()
                            // if saves successfully response should be successful
                            .then(response => {
                                res.status(200).json({
                                success: true,
                                result: response
                                })
                            })
                            // else spit out the error
                            .catch(err => {
                                res.status(500).json({
                                    errors: [{ error: err }]
                                });
                            });
                    });
                });
            }
        })
        // if there's an error before trying to find the email
        .catch(err => {
            res.status(500).json({
                errors: [{ error: 'Something went wrong' }]
            });
        })
}

// auth route for login/sign in 
exports.signin = (req, res) => {
    // destructure request body 
    let { email, password } = req.body;
    // find user with similar email
    User.findOne({ email: email }).then(user => {
      // if user does not exist return not foudn 
      if (!user) {
        return res.status(404).json({
          errors: [{ user: "not found" }],
        });
        // if user exist decript encripted password and compare passwords
      } else {
         bcrypt.compare(password, user.password).then(isMatch => {
            // if passwords dont match return message that password is incorrect
            if (!isMatch) {
             return res.status(400).json({ errors: [{ password:"incorrect" }] });
            }
            // create JWT using email id and number and duration of one hour 
            let access_token = createJWT(user.email, user._id, '1h');
            // compare access token with secret token 
            jwt.verify(access_token, process.env.TOKEN_SECRET, (err,decoded) => {
                if (err) {
                res.status(500).json({ errors: err });
                }
                // jwt the same status of true send jwt key/token to front end and user info
                if (decoded) {
                    return res.status(200).json({
                    success: true,
                    token: access_token,
                    message: user
                    });
                }
            });
        // error in the bycrpt stage 
        }).catch(err => {
         res.status(500).json({ errors: err });
        });
      }
    // error in the email stage 
    }).catch(err => {
     res.status(500).json({ errors: err });
  });
}