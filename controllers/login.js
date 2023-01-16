const db = require("../models");
const MyError = require("../utils/utils");

exports.getLogin = (req, res, next) => {
    console.log("login get")
    if(req.session.connection){
        res.render('homePage', {
            titlePage: 'NASA'
        });
    }else{
        //TODO validation
        res.render('login', {
            titlePage: 'login',
            msgP1: 'Please Sign-In',
            msgP2:'Exercise 6 (Part 1)',
            message:req.cookies.message
        });
    }


}

exports.postLogin = async (req, res, next) => {
    /////////  Just started - only loads without doing anything   /////////
    try {
        const validUser = await db.User.findOne({ where: {email: req.body.emailLogin}})
    if (!validUser) //check if the entered email is caught
        throw new MyError(`The email is not in the system.`,`/`);

   // const validUser = await db.User.findByPk(validPassword.dataValues.id);

    if(validUser.dataValues.password !== req.body.passwordLogin)
        throw new MyError(`The password is not in the system.`,`/`);

    req.session.connection = true;
    req.session.id = `${validUser.dataValues.id}`;
    req.session.userFullName =`${validUser.dataValues.firstName} ${validUser.dataValues.lastName}`

    res.redirect('/')
    } catch (error) {
        if(error instanceof MyError) {
            res.cookie("message", error.message);
            return res.redirect(error.redirect);
        }
        res.status(500).send('Error occurred');
    }
}

