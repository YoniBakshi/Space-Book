let express = require('express');
let router = express.Router();
const homeController = require('../controllers/home')

/* GET home page. */
router.get('/', homeController.getHome);
router.post('/resources', homeController.postHome);

// Getting a single resource
// for example /resources/123 where 123 is some identifier to search for a resource
router.delete("/del/:id",homeController.deleteComment)
router.get('/resources/:id', homeController.getComments )

module.exports = router;