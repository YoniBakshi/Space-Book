const User = require('../models/user')

// Responsible on the error messages
exports.header = (req, res, next) => {
    res.locals.error = req.cookies.error || false;
    res.locals.title = "This is a default title";
    res.locals.registerData = {};

    if (req.cookies.error)
        res.clearCookie('error');
    next();
}

/**
 * Register button was clicked or time expired /
 * @param req
 * @param res
 * @param next
 */
exports.getRegister = (req, res, next) =>{
    console.log("reg get")

    // TODO validation
    // Contains all the data of current cookie or if theres no data so no cookie
    let registerData = req.cookies.registerData ? req.cookies.registerData : {}

    res.render('register', {
        title: 'register',
        registerData});
}

exports.postRegister = (req, res, next) =>{
    const userFirstName = req.body.firstName.trim();
    const userLastName = req.body.lastName.trim();
    const userEmail = req.body.emailRegister.trim().toLowerCase();

    /*if ...
    res.cookie("error", "This Email is already in use 1", {maxAge : 30 * 10 * 100, httpOnly : true})
    return res.redirect("/users/register");*/



    try {
        //Supposed to be inside try but it might change - started
        res.cookie("registerData", {userFirstName, userLastName, userEmail} , {maxAge : 10 * 10 * 100, httpOnly : true})

        if(User.fetchAll().find((item) => item.email === this.email)) {
            res.cookie("error", "This email is already in use 1")
            console.log("error post reg")
            return res.redirect("./register/")
        }
        res.redirect('/users/register-password')
    } catch(err) {
        console.log("reg postghjkghjk")

        //TODO
    }
}
/*
exports.postRegisterPassword = (req, res, next) =>{
    //TODO validation
    res.render('register-password', {
        title: 'register-password',
        name: 'YoniBayony2',
        boolian: 5<6});}*/
