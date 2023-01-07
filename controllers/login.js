exports.getLogin = (req, res, next) =>{
    console.log("login get")
    //TODO validation
    res.render('login', { title: 'login',
    name: 'hilapila',
    boolian: 5<6});}



