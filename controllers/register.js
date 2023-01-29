const db = require('../models')
const MyError = require('../utils/utils')

/**
 * Register button was clicked or time expired
 */
exports.getRegister = (req, res) => {

    // Contains all the data of current cookie or if theres no data so no cookie
    let registerData = req.cookies.registerData ? req.cookies.registerData : {}

    res.render('register', {
        titlePage: 'register',
        msgP1: 'Please Register',
        msgP2:'Register',
        backgroundImage: 'LoginBackground.png',
        message:req.cookies.message,
        registerData});
}

/**
 * Receive input and save data of part 1 registration on a cookie for 30 seconds.
 */
exports.postRegister = async (req, res) => {
    // All fields must contain 3-32 letters.
    const userFirstName = req.body.firstName.trim();
    const userLastName = req.body.lastName.trim();
    const userEmail = req.body.emailRegister.trim().toLowerCase();      // No difference between uppercase or lowercase as requested.

    try {
        if(req.cookies.registerData) {
            res.clearCookie("registerData");
        }
        res.cookie("registerData", {userFirstName, userLastName, userEmail} , {maxAge : 30 * 10 * 100, httpOnly : true});

        const existingUser = await db.User.findOne({ where: { email: userEmail } });
        if (existingUser)
            throw new MyError(`The email is already in use, please choose other one.`, `/users/register`);

        res.redirect('/users/register-password');
    } catch(error) {
        if(error instanceof MyError) {
            res.cookie("message", error.message);
            return res.redirect(error.redirect);
        }
        res.status(500).send('Error occurred');
    }
}
