const User = require('../models/user')

exports.getRegister = (req, res, next) =>{
    console.log("reg get")
    //TODO validation
    res.render('register', {
        title: 'register',
        name: 'YoniBayony2',
        boolian: 5<6});
}

exports.postRegister = (req, res, next) =>{
    console.log(req.body.emailRegister)
    try{
    const userInfo = new User(req.body.emailRegister, req.body.firstName, req.body.lastName)
        userInfo.save()
        res.redirect('/register-password')
    }catch(err){
        console.log("reg postghjkghjk")

        //TODO
    }
}

