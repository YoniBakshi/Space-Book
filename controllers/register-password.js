const db = require('../models')

// Next was clicked - load the next pagee which is register password
exports.getRegisterPassword = (req, res, next) => {
    //TODO validation
    if (!req.cookies.registerData) {
        res.cookie("message", "basush Registration process expired. Please start again. FASTER DUDE");
        return res.redirect('/users/register');
    }

    res.render('register-password', {
        title: 'register-password'
    });
}

exports.postRegisterPassword = async (req, res, next) => {
    try {
        //check if the cookie exist
        const dataCookie = req.cookies.registerData;
        //if it's not already exist return error
        if (!dataCookie) {
            res.cookie("message", "Registration process expired. Please start again.");
            return res.redirect('/users/register');
        }
        //check if the entered email is caught
        const existingUser = await db.User.findOne({ where: { email: dataCookie.userEmail } });
        //if it's already exist return error
        if (existingUser) {
            res.cookie("message", "The email is already in use, please choose other one.");
            return res.redirect('/users/register');
        }
        const { userEmail: email, userFirstName: firstName, userLastName: lastName } = dataCookie;
        const password = req.body.passwordRegister;
        //create a row in the table
        await db.User.create({ email, firstName, lastName, password });
        //to debug
/*        const users = await db.User.findAll();
        console.log(users);*/
        if(password !== req.body.passwordConfirm){
            res.cookie("message", "Passwords do not match, please try again.");
            return res.redirect('/users/register-password');
        }
        if(req.cookies.registerData) {
            res.clearCookie("registerData");
        }
        //if succeed go back to login
        res.cookie("message", "Registration successful, you can login now");
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error occured');
    }
}

