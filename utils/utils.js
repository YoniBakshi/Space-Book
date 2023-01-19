
module.exports = class MyError extends Error {
    constructor(message, redirect) {
        super(message);
        this.redirect = redirect;
    }
}

exports.handleError = (error, res) => {
    if(error instanceof MyError) {
        res.cookie("message", error.message);
        return res.redirect(error.redirect);
    }
    res.status(500).send('Error occurred');
}