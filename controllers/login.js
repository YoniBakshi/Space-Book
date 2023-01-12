exports.getLogin = (req, res, next) => {
    console.log("login get")
    //TODO validation
    res.render('login', {title: 'login',});
}

exports.postLogin = (req, res, next) => {
    /////////  Just started - only loads without doing anything   /////////
    console.log(";lkjhgfdfghjklkjhgf")
}
