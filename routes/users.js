let express = require('express');
// Load the controllers
const registerController = require("../controllers/register");
const registerPasController = require("../controllers/register-password");

let router = express.Router();

/* /register => GET users listing. */
router.get('/register', registerController.getRegister)

/* /register => POST users listing. */
router.post('/register', registerController.postRegister)

/* POST users listing. */
router.get('/register-password', registerPasController.postRegisterPassword)


module.exports = router;
