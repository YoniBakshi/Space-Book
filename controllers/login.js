const db = require("../models");
exports.getLogin = (req, res, next) => {
    console.log("login get")
    if(req.session.visitor === 1){
        res.render('register', {
            titlePage: 'login',
            msgP1: 'Please Sign-In',
            msgP2:'Exercise 6 (Part 1)',
            message:req.cookies.message
        });
    }else{
        console.log(req.session.visitor)
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
      //  let currUser = await db.User.findOne({ where: {email: req.body.EmailLogin} ,
        //C   attributes: ['id']})
       // if (!currUser)
       //     throw new MyError(`The email is not in the system.`,`/`);
       // let dataUser = SELECT id, currUser FROM Users;
       // console.log(dataUser)

    if (!await db.User.findOne({ where: {email: req.body.EmailLogin}})) //check if the entered email is caught
        throw new MyError(`The email is not in the system.`,`/`);

    const validPassword = await db.User.findOne({ where: {email: req.body.EmailLogin} ,
        attributes: ['password', 'firstName', 'lastName']})
    if(validPassword.dataValues.password !== req.body.passwordLogin)
        throw new MyError(`The password is not in the system.`,`/`);
    req.session.visitor =1;
    req.session.userFullName =`${validPassword.dataValues.firstName} ${validPassword.dataValues.lastName}`

    res.redirect('/')
    } catch (error) {
        if(error instanceof MyError) {
            res.cookie("message", error.message);
            return res.redirect(error.redirect);
        }
        res.status(500).send('Error occurred');
    }
    console.log(";lkjhgfdfghjklkjhgf")
}




class MyError extends Error {
    constructor(message, redirect) {
        super(message);
        this.redirect = redirect;
    }
}
