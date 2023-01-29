const db = require("../models");
const MyError = require("../utils/utils");
const bcrypt = require('bcrypt');

/**
 * Loads Login Page, if there's an existing session - Home/feed page will be loaded
 * @param req
 * @param res
 */
exports.getLogin = (req, res) => {

    if (req.session.connection) {
        res.redirect('/home')
    } else {
        res.render('login', {
            titlePage: 'login',
            msgP1: '',
            msgP2: '',
            backgroundImage: 'LoginBackground.png',
            message: req.cookies.message
        });
    }
}

/**
 * Logout and delete session of this user and return to login page.
 */
exports.getLogout = (req, res) => {

    if (req.session.connection)
        delete req.session.connection

    res.redirect('/')
}

/**
 * Validate Email and password with User DB , if valid - A session will be started, if not - Error message will appear if not exist or not matching data. (For security reasons)
 */
exports.postLogin = async (req, res) => {
    try {
        const validUser = await db.User.findOne({where: {email: req.body.emailLogin}})
        if (!validUser) //check if the entered email is caught
            throw new MyError(`Email or password doesn't match/exist in the system.`, `/`);

        if (!await bcrypt.compare(req.body.passwordLogin, validUser.dataValues.password))
            throw new MyError(`Email or password doesn't match/exist in the system.`, `/`);

        req.session.connection = true;
        req.session.userid = `${validUser.dataValues.id}`;
        req.session.userFullName = `${validUser.dataValues.firstName} ${validUser.dataValues.lastName}`

        res.redirect('/')
    } catch (error) {
        if(error instanceof MyError) {
            res.cookie("message", error.message);
            return res.redirect(error.redirect);
        }
        res.status(500).send('Error occurred');
    }
}

