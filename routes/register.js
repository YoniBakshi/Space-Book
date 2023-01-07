let express = require('express');
// Load the controllers
const loginController = require("../controllers/register");

let router = express.Router();

/* /register => GET users listing. */
router.get('/', loginController.getRegister)

/* /register => POST users listing. */
router.post('/', loginController.postRegister)



module.exports = router;
