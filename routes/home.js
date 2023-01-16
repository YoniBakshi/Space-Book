let express = require('express');
let router = express.Router();
const homeController = require('../controllers/home')

/* GET home page. */
router.get('/', homeController.getHome);
router.post('/', homeController.postHome);

module.exports = router;