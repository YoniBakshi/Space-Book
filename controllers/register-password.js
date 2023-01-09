
// Next was clicked - load the next pagee which is register password
exports.getRegisterPassword = (req, res, next) => {
    //TODO validation
    if (!req.cookies.registerData) {
        res.cookie("error", "The time has expired basuhsh", {maxAge : 30 * 10 * 100, httpOnly : true});
        return res.redirect('/users/register');
    }

    res.render('register-password', {
        title: 'register-password'
    });
}


exports.postRegisterPassword = (req, res, next) => {
    // Receive cookie
    const dataCookie = req.cookies.registerData ? req.cookies.registerData : {} ;
    const userInfo = new User (dataCookie.userFirstName, dataCookie.userLastName, dataCookie.userEmail, req.body.passwordRegister);

    try {
        if(!userInfo.save()) {
            res.cookie ("error", "The email is already exist 2, FASTER NEXT TIME DUDE", {maxAge : 30 * 10 * 100, httpOnly : true});
            return res.redirect('/users/register');
        }

        // If cookies was expired
        if (!req.cookies.registerData) {
            res.cookie("error", "The time has expired basuhsh", {maxAge : 30 * 10 * 100, httpOnly : true});
            return res.redirect('/users/register');
        }
        return res.redirect('/');
    }
    catch {
        // TODO
    }

}