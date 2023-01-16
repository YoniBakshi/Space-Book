const db = require("../models");
const MyError = require("../utils/utils");

exports.getHome = (req, res, next) => {

        //TODO validation
        res.render('homePage', {
            titlePage: 'NASA'
        });
}

exports.postHome = async (req, res, next) => {
    /////////  Just started - only loads without doing anything   /////////
    try {

    } catch (error) {
        if(error instanceof MyError) {
            res.cookie("message", error.message);
            return res.redirect(error.redirect);
        }
        res.status(500).send('Error occurred');
    }
}

