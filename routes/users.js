let express = require('express');
// Load the controllers
const registerController = require("../controllers/register");
const registerPassController = require("../controllers/register-password");

let router = express.Router();

/* Middleware of errors */
router.use(registerController.header);

/* /register => GET users listing. */
router.get('/register', registerController.getRegister)

/* /register => POST users listing. */
router.post('/register', registerController.postRegister)

/* GET users listing. */
router.get('/register-password', registerPassController.getRegisterPassword)

/* POST users listing. */
router.post('/register-password', registerPassController.postRegisterPassword)

module.exports = router;
