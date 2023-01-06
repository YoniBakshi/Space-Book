let express = require('express');
let router = express.Router();
const loginController = require('../controllers/login')

/* GET home page. */
router.get('/', loginController.loginScreen);

module.exports = router;
