const db = require("../models");
exports.getLogin = (req, res, next) => {
    console.log("login get")
    //TODO validation
    res.render('login', {
        titlePage: 'login',
        msgP1: 'Please Sign-In',
        msgP2:'Exercise 6 (Part 1)',
        message:req.cookies.message});
}

exports.postLogin = async (req, res, next) => {
    /////////  Just started - only loads without doing anything   /////////
    try {
    if (!await db.User.findOne({ where: {email: req.body.EmailLogin}})) //check if the entered email is caught
        throw new MyError(`The email is not in the system.`,`/`);
    const validPassword = await db.User.findOne({ where: {email: req.body.EmailLogin} ,
        attributes: ['password']})
    if(validPassword.dataValues.password !== req.body.passwordLogin)
        throw new MyError(`The password is not in the system.`,`/`);


    } catch (error) {
        if(error instanceof MyError) {
            res.cookie("message", error.message);
            return res.redirect(error.redirect);
        }
        res.status(500).send('Error occurred');
    }
    console.log(";lkjhgfdfghjklkjhgf")
}



exports.postRegisterPassword = async (req, res, next) => {
    try {
        if (!req.cookies.registerData)  //check if the cookie exist
            throw new MyError(`Registration process expired, Please start again.`,`/users/register`);

        if (await db.User.findOne({ where: {email: req.cookies.registerData.userEmail}})) //check if the entered email is caught
            throw new MyError(`The email is already in use, please choose other one.`,`/users/register`);

        const { userEmail: email, userFirstName: firstName, userLastName: lastName } = req.cookies.registerData;
        const password = req.body.passwordRegister;

        if(password !== req.body.passwordConfirm) //password validation
            throw new MyError(`Passwords do not match, please try again.`,`/users/register-password`);

        await db.User.create({ email, firstName, lastName, password }); //if succeed go back to login
        res.clearCookie("registerData");
        res.cookie("message", "Registration successful, you can login now.");
        return res.redirect('/');

    } catch (error) {
        if(error instanceof MyError) {
            res.cookie("message", error.message);
            return res.redirect(error.redirect);
        }
        res.status(500).send('Error occurred');
    }
}

class MyError extends Error {
    constructor(message, redirect) {
        super(message);
        this.redirect = redirect;
    }
}
