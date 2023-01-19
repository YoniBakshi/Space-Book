const db = require("../models");
const MyError = require("../utils/utils");

exports.getHome = (req, res, next) => {

        //TODO validation
        res.render('homePage', {
            titlePage: 'NASA',
            userFullName: req.session.userFullName
        });
}

exports.postHome = async (req, res, next) => {
    try {
        const comment = req.body.currComment;
        const imgId = req.body.id;
        const userEmail = req.session.email;
        const status = false;

        // Validate request body
            if (!userEmail || !imgId || !comment)
                return res.status(400).json({ message: 'All fields are required' });

            // Check if userName is a string
            if (typeof userEmail !== 'string')
                return res.status(400).json({ message: 'userId must be a string' });

            // Check if id is a valid date
            if (!Date.parse(imgId))
                return res.status(400).json({ message: 'id must be a valid date' });

            // Check if currComment is a string
            if (typeof comment !== 'string')
                return res.status(400).json({ message: 'comment must be a string' });

        db.Comment.create({userEmail, comment, imgId, status})

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
        const commentList = await db.Comment.findAll({ where: {imgId: resourceId}})
        const result = [];

        for (const item of commentList) {
            const userOwner = await db.User.findOne({where: {email: item.dataValues.userEmail}})
            if(!item.dataValues.status){
                const firstName = userOwner.dataValues.firstName
                const lastName = userOwner.dataValues.lastName
                const commentId = item.dataValues.id
                const comment = item.dataValues.comment
                const owner = req.session.email === userOwner.dataValues.email
                result.push({firstName, lastName, owner, commentId, comment})
            }
        }

        res.status(200).json(result)
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
        await db.Comment.update({status: true}, {where: {id: resourceId}});

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