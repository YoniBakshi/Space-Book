var express = require('express');
const loginController = require("../controllers/register");
var router = express.Router();

/* GET users listing. */
router.get('/', loginController.getRegister)

/* POST users listing. */
router.post('/data', loginController.postRegister)


module.exports = router;
