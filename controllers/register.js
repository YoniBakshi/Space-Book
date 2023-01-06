const User = require('../models/user')
exports.getRegister = (req, res, next) =>{
    console.log("reg get")
    //TODO validation
    res.render('register', { title: 'register',
        name: 'YoniBayony2',
        boolian: 5<6});
}

exports.postRegister = (req, res, next) =>{
    console.log("reg post")

    try{
    const userInfo = new User(req.body.email, req.body.firstName, req.body.lastName)
        userInfo.save()
        res.redirect('/')
    }catch(err){
        //TODO
    }
}

