//const Cookies = require('cookies')
const db = require('../models')

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
        titlePage: 'register',
        msgP1: 'Please Register',
        msgP2:'Register',
        message:req.cookies.message,
        registerData});
}

exports.postRegister = async (req, res, next) => {
    const userFirstName = req.body.firstName.trim();
    const userLastName = req.body.lastName.trim();
    const userEmail = req.body.emailRegister.trim().toLowerCase();

    try {
        if(req.cookies.registerData) {
            res.clearCookie("registerData");
        }
        res.cookie("registerData", {userFirstName, userLastName, userEmail} , {maxAge : 30 * 10 * 100, httpOnly : true});

        const existingUser = await db.User.findOne({ where: { email: userEmail } });
        if (existingUser) {
            res.cookie("message", "The email is already in use, please choose other one.");
            return res.redirect('/users/register');
        }
        res.redirect('/users/register-password');
    } catch(err) {
        console.log(err);
        res.cookie("message", "Error Occured, Please try again later");
        return res.redirect('/users/register');
    }
}
