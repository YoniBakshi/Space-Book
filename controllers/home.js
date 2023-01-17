const db = require("../models");
const MyError = require("../utils/utils");
let itGoJson = []
let index = 0;

exports.getHome = (req, res, next) => {

        //TODO validation
        res.render('homePage', {
            titlePage: 'NASA',
            userId: req.session.id,
            userFullName: req.session.userFullName
        });
}

exports.postHome = async (req, res, next) => {
    try {
        const comment = req.body.currComment;
        const imgId = req.body.id;
        const userId = req.session.id;
        const status = false;

        // Validate request body
            if (!userId || !imgId || !comment) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            // Check if userName is a string
            if (typeof userId !== 'string') {
                return res.status(400).json({ message: 'userId must be a string' });
            }

            // Check if id is a valid date
            if (!Date.parse(imgId)) {
                return res.status(400).json({ message: 'id must be a valid date' });
            }

            // Check if currComment is a string
            if (typeof comment !== 'string')
                return res.status(400).json({ message: 'comment must be a string' });

        db.Comment.create({userId, comment, imgId, status})

        // If all validation checks pass, create resource

/*
        let resource = {
            commentField: req.body.currComment,
            username: name,
            id: date,
            postId: index,
        };
        index++;
        itGoJson.push(resource);*/
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
        const validUser = await db.Comment.findAll({ where: {imgId: resourceId}})

       // const resource = validUser.filter(w => w.status === false);
        res.status(200).json(validUser)
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