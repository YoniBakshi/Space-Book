const db = require("../models");
const MyError = require("../utils/utils");
const bcrypt = require('bcrypt');

exports.getLogin = (req, res) => {
    console.log("login get")
    if (req.session.connection) {
        res.redirect('/home')
    } else {
        res.render('login', {
            titlePage: 'login',
            msgP1: '',
            msgP2: '',
            //  msgP1: 'Please Sign-In',        // TODO
            //  msgP2: 'Exercise 6 (Part 1)',
            backgroundImage: 'LoginBackground.png',
            message: req.cookies.message
        });
    }
}

exports.getLoguot = (req, res) => {
    console.log("login get")
    if (req.session.connection)
        delete req.session.connection

    res.redirect('/')
}

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

