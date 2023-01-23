
module.exports = class MyError extends Error {
    constructor(message, redirect) {
        super(message);
        this.redirect = redirect;
    }
}

/**
 * Handles any errors that occur in the getComments function
 * @param error.message - Contain the error message
 * @param error.redirect - Contain the wanted path to be loaded
 */
exports.handleError = (error, res) => {
    if(error instanceof MyError) {
        res.cookie("message", error.message);
        return res.redirect(error.redirect);
    }
    res.status(500).send('Error occurred');
}