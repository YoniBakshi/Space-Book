var express = require('express');
const loginController = require("../controllers/register-password");
var router = express.Router();

/* GET users listing. */
router.get('/', loginController.postPAss)


module.exports = router;
