const db = require('../models')
const MyError = require("../utils/utils");
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Next was clicked - load the next pagee which is register password
exports.getRegisterPassword = (req, res) => {
    //TODO validation
    //to block access to register password page
    if (!req.cookies.registerData)
        res.redirect('/users/register')

    res.render('register-password', {
        titlePage: 'register-password',
        msgP1: 'Please choose a password',
        msgP2: 'Register',
        backgroundImage: 'LoginBackground.png',
        message: req.cookies.message
    });
}

exports.postRegisterPassword = async (req, res, next) => {
    try {
        if (!req.cookies.registerData)  //check if the cookie exist
            throw new MyError(`Registration process expired, Please start again.`, `/users/register`);

        if (await db.User.findOne({where: {email: req.cookies.registerData.userEmail}})) //check if the entered email is caught
            throw new MyError(`The email is already in use, please choose other one.`, `/users/register`);

        const {userEmail: email, userFirstName: firstName, userLastName: lastName} = req.cookies.registerData;
        let password = req.body.passwordRegister;

        if (req.body.passwordRegister !== req.body.passwordConfirm) //password validation
            throw new MyError(`Passwords do not match, please try again.`, `/users/register-password`);
        password = await bcrypt.hash(req.body.passwordRegister, saltRounds);
        await db.User.create({email, firstName, lastName, password}); //if succeed go back to login
        res.clearCookie("registerData");
        res.cookie("message", "Registration successful, you can login now.");
        return res.redirect('/');

    } catch (error) {
        if(error instanceof MyError) {
            res.cookie("message", error.message);
            return res.redirect(error.redirect);
        }
        res.status(500).send('Error occurred');
        //MyError.handleError(error, res);
    }
}
