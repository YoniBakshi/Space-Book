let express = require('express');
const loginController = require("../controllers/register-password");
let router = express.Router();

/* POST users listing. */
router.get('/', loginController.postRegisterPassword)


module.exports = router;
