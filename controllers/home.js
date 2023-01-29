const db = require("../models");

/**
 * This function is responsible for rendering the homePage view and providing
 * the titlePage and userFullName data to the view.
 * @param req - request object containing information about the incoming request
 * @param res - response object used to send response to the client
 */
exports.getHome = (req, res) => {
    res.render('homePage', {
        titlePage: 'NASA',
        userFullName: req.session.userFullName,
        backgroundImage: 'FeedBackground.png',
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
        const userId = req.session.userid;
        const status = false;

        // Validate request body
        validateRequestBody(userId, imgId, comment, res);
        // Check if userName is a string
        checkIfString(userId, 'userId', res);
        // Check if id is a valid date
        checkIfValidDate(imgId, res);
        // Check if currComment is a string
        checkIfString(comment, 'comment', res);

        // Create new comment
        const c = await db.Comment.create({userId, comment, imgId, status});
        return res.json(c);

    } catch (error) {
        return res.status(400).json({message: error.message});
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
        throw new Error(`All fields are required`);
    }
}

/**
 * Check if variable is a string
 * @param userInfo - be userEmail or comment to be validated
 * @param variableName - The name of the variable inside the database
 */
function checkIfString(userInfo, variableName, res) {
    if (typeof userInfo !== 'string')
        throw new Error(`${variableName} must be a string`)
}

/**
 * Check if variable is a valid date
 * @param theDate - The date to be validated
 */
function checkIfValidDate(theDate, res) {
    if (!Date.parse(theDate))
        throw new Error(`id must be a valid date`)
}

/**
 * Validate date of image to be opened in Modal and Get comments to specific this specific picture id = date .
 */
exports.getComments = async (req, res) => {
    try {
        checkIfValidDate(req.params.id)
        // Must have "await"
        const result = await getCommentDetails(req.params.id, req.session.userid);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

/**
 * Query once - Using relation between Cooment DB and User DB
 * @param imgDate = id of image
 * @param currUserId
 */
const getCommentDetails = async (imgDate, currUserId) => {
    try {
        const commentList = await db.Comment.findAll({
            where: {imgId: imgDate, status: false},
            include: [{
                model: db.User,
                attributes: [`firstName`, `lastName`],
            }]
        })

        const result = [];

        commentList.forEach((currComment) => {
            const firstName = currComment.dataValues.User.dataValues.firstName
            const lastName = currComment.dataValues.User.dataValues.lastName
            const commentId = currComment.dataValues.id
            const comment = currComment.dataValues.comment
            const owner = currUserId === currComment.dataValues.userId.toString()
            result.push({firstName, lastName, owner, commentId, comment})
        })

        return result;
    } catch (error) {
        throw new Error(error.message)
    }
}

/**
 * HELLO I DELETE COMMENTS YA
 */
exports.deleteComment = async (req, res) => {
    try {
        const resourceId = Number(req.params.id);
        await db.Comment.update({status: true}, {where: {id: resourceId}});
        // Return a success response
        return res.status(200).json({message: "Success"});
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}
