exports.getLogin = (req, res, next) => {
    console.log("login get")
    //TODO validation
    res.render('login', {
        titlePage: 'login',
        msgP1: 'Please Sign-In',
        msgP2:'Exercise 6 (Part 1)',
        message:req.cookies.message});
}

exports.postLogin = (req, res, next) => {
    /////////  Just started - only loads without doing anything   /////////
    console.log(";lkjhgfdfghjklkjhgf")
}
