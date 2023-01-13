const db = require("../models");
exports.getLogin = (req, res, next) => {
    console.log("login get")
    if(req.session.visitor === 1){
        req.session.visitor = 0;
        res.render('register', {
            titlePage: 'login',
            msgP1: 'Please Sign-In',
            msgP2:'Exercise 6 (Part 1)',
            message:req.cookies.message
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
        const validPassword = await db.User.findOne({ where: {email: req.body.EmailLogin} ,
            attributes: ['id']})
    if (!validPassword) //check if the entered email is caught
        throw new MyError(`The email is not in the system.`,`/`);

    const validUser = await db.User.findByPk(validPassword.dataValues.id);

    if(validUser.dataValues.password !== req.body.passwordLogin)
        throw new MyError(`The password is not in the system.`,`/`);

    req.session.visitor =1;
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




class MyError extends Error {
    constructor(message, redirect) {
        super(message);
        this.redirect = redirect;
    }
}
