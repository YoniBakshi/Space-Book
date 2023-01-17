const db = require("../models");
const MyError = require("../utils/utils");
let itGoJson = []
let index = 0;
exports.getHome = (req, res, next) => {

        //TODO validation
        res.render('homePage', {
            titlePage: 'NASA',
            userName: req.session.userFullName
        });
}

exports.postHome = async (req, res, next) => {
    try {
        // Validate request body
        /*    if (!req.body.userName || !req.body.id || !req.body.currComment) {
                return res.status(400).json({ message: 'All fields are required' });
            }*/
        /*
            // Check if userName is a string
            if (typeof req.body.userName !== 'string') {
                return res.status(400).json({ message: 'userName must be a string' });
            }

            // Check if id is a valid date
            if (!Date.parse(req.body.id)) {
                return res.status(400).json({ message: 'id must be a valid date' });
            }

            // Check if currComment is a string
            if (typeof req.body.currComment !== 'string') {
                return res.status(400).json({ message: 'currComment must be a string' });
            }*/

        // If all validation checks pass, create resource
        const name = req.session.userFullName;
        const date = req.body.id;
        let resource = {
            commentField: req.body.currComment,
            username: name,
            id: date,
            postId: index,
        };
        index++;
        itGoJson.push(resource);
        res.json(itGoJson);
    } catch (error) {
        if(error instanceof MyError) {
            res.cookie("message", error.message);
            return res.redirect(error.redirect);
        }
        res.status(500).send('Error occurred');
    }
}


exports.getComments = async (req, res, next) => {

    try {
        const resourceId = req.params.id;

        const resource = itGoJson.filter(w => w.id === resourceId);

        res.status(200).json(resource)
    } catch (error) {
        if(error instanceof MyError) {
            res.cookie("message", error.message);
            return res.redirect(error.redirect);
        }
        res.status(500).send('Error occurred');
    }
}


exports.deleteComment = async (req, res, next) => {

    try {
        const resourceId = Number(req.params.id);

        // Find the index of the resource in the itGoJson array
        const index = itGoJson.findIndex(w => w.postId === resourceId);

        // If the resource is not found, return a 404 response
        if (index === -1) {
            return res.status(404).json({msg: `Resource not found. id ${resourceId}`});
        }
        // Remove the resource from the array
        itGoJson.splice(index, 1);

        // Return a success response
        res.status(200).json({msg: "Success"});
    } catch (error) {
        if(error instanceof MyError) {
            res.cookie("message", error.message);
            return res.redirect(error.redirect);
        }
        res.status(500).send('Error occurred');
    }
}