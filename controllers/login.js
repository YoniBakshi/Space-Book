exports.getLogin = (req, res, next) =>{
    console.log("login get")
    //TODO validation
    res.render('login', { title: 'login',});
}
