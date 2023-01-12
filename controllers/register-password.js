const db = require('../models')

// Next was clicked - load the next pagee which is register password
exports.getRegisterPassword = (req, res, next) => {
    //TODO validation
    if (!req.cookies.registerData) {
        res.cookie("error", "The time has expired basuhsh");
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
            res.cookie("error", "The time has expired");
            return res.redirect('/users/register');
        }
        //check if the entered email is caught
        const existingUser = await db.User.findOne({ where: { email: dataCookie.userEmail } });
        //if it's already exist return error
        if (existingUser) {
            res.cookie("error", "The email is already exist 2, FASTER NEXT TIME DUDE");
            return res.redirect('/users/register');
        }
        const { userEmail: email, userFirstName: firstName, userLastName: lastName } = dataCookie;
        const password = req.body.passwordRegister;
        //create a row in the table
        await db.User.create({ email, firstName, lastName, password });

        //to debug
/*        const users = await db.User.findAll();
        console.log(users);*/
        //if succeed go back to login
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error occured');
    }
}

