const db = require("../models");
const MyError = require("../utils/utils");

/**
 * This function is responsible for rendering the homePage view and providing
 * the titlePage and userFullName data to the view.
 * @param req - request object containing information about the incoming request
 * @param res - response object used to send response to the client
 */
exports.getHome = (req, res) => {
        res.render('homePage', {
            titlePage: 'NASA',
            userFullName: req.session.userFullName
        });
}

/**
 * Receive comment of client and save input to our database
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.postHome = async (req, res) => {
    try {
        // Retrieve comment, image ID, and user email from request body
        const comment = req.body.currComment;
        const imgId = req.body.id;
        const userEmail = req.session.email;
        const status = false;

        // Validate request body
        validateRequestBody(userEmail, imgId, comment, res);
        // Check if userName is a string
        checkIfString(userEmail, 'userId', res);
        // Check if id is a valid date
        checkIfValidDate(imgId, res);
        // Check if currComment is a string
        checkIfString(comment, 'comment', res);

        // Create new comment
        await db.Comment.create({userEmail, comment, imgId, status});

    } catch (error) {
        handleError(error, res); //KAPARAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

    }
}

/**
 * Validate request body by checking if all fields aren't empty
 * @param userEmail - A unique user's email to identify a client
 * @param imgId     - is the date of image
 * @param comment   - Input comment
 */
function validateRequestBody(userEmail, imgId, comment, res) {
    if (!userEmail || !imgId || !comment) {
        return res.status(400).json({ message: 'All fields are required' });
    }
}

/**
 * Check if variable is a string
 * @param userInfo - be userEmail or comment to be validated
 * @param variableName - The name of the variable inside the database
 */
function checkIfString(userInfo, variableName, res) {
    if (typeof userInfo !== 'string') {
        return res.status(400).json({ message: `${variableName} must be a string` });
    }
}

/**
 * Check if variable is a valid date
 * @param theDate - The date to be validated
 */
function checkIfValidDate(theDate, res) {
    if (!Date.parse(theDate)) {
        return res.status(400).json({ message: 'id must be a valid date' });
    }
}


/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
exports.getComments = async (req, res, next) => {
    try {
        const resourceId = req.params.id;
        const commentList = await getCommentList(resourceId);
        const result = await getCommentDetails(commentList, req.session.email);
        res.status(200).json(result);
    } catch (error) {
        handleError(error, res);
    }
}

/**
 * Retrieves a list of comments for a given image ID
 * @param resourceId
 * @returns {Promise<*>}
 */
const getCommentList = async (resourceId) => {
    return await db.Comment.findAll({ where: {imgId: resourceId}});
}

/**
 * Retrieves additional details for each comment in the list
 * @param commentList
 * @param userEmail
 * @returns {Promise<Array>}
 */
const getCommentDetails = async (commentList, userEmail) => {
    const result = [];
    for (const item of commentList) {
        const userOwner = await db.User.findOne({where: {email: item.dataValues.userEmail}})
        if(!item.dataValues.status){
            const firstName = userOwner.dataValues.firstName
            const lastName = userOwner.dataValues.lastName
            const commentId = item.dataValues.id
            const comment = item.dataValues.comment
            const owner = userEmail === userOwner.dataValues.email
            result.push({firstName, lastName, owner, commentId, comment})
        }
    }
    return result;
}

/**
 * Handles any errors that occur in the getComments function
 * @param error.message - Contain the error message
 * @param error.redirect - Contain the wanted path to be loaded
 */
const handleError = (error, res) => {
    if(error instanceof MyError) {
        res.cookie("message", error.message);
        return res.redirect(error.redirect);
    }
    res.status(500).send('Error occurred');
}

/**
 * HELLO I DELETE COMMENTS YA
 *
 */
exports.deleteComment = async (req, res) => {
    try {
        const resourceId = Number(req.params.id);
        await db.Comment.update({status: true}, {where: {id: resourceId}});
        // Return a success response
        res.status(200).json({msg: "Success"});
    } catch (error) {
        handleError(error, res);
    }
}