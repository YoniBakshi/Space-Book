let express = require('express');
// Load the controllers
const loginController = require("../controllers/register");
const loginC = require("../controllers/register-password");

let router = express.Router();

/* /register => GET users listing. */
router.get('/register', loginController.getRegister)

/* /register => POST users listing. */
router.post('/register', loginController.postRegister)

/* POST users listing. */
router.get('/register-password', loginC.postRegisterPassword)


module.exports = router;
