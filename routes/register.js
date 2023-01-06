let express = require('express');
// Load the controllers
const loginController = require("../controllers/register");

let router = express.Router();

/* /register/ => GET users listing. */
router.get('/', loginController.getRegister)

/* /register/data => POST users listing. */
router.post('/data', loginController.postRegister)


module.exports = router;
