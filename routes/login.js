let express = require('express');
let router = express.Router();
const loginController = require('../controllers/login')

/* GET home page. */
router.get('/', loginController.getLogin);
router.get('/logout', loginController.getLoguot);
router.post('/', loginController.postLogin);

module.exports = router;