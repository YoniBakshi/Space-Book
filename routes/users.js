var express = require('express');
const loginController = require("../controllers/login");
var router = express.Router();

/* GET users listing. */
router.get('/', loginController.loginScreenbtn)


module.exports = router;
