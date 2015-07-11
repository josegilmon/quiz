var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var authorController = require('../controllers/author_controller');

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Quiz' });
});

/* GET quiz page. */
router.get('/quizes/question', quizController.question);

/* GET answers page. */
router.get('/quizes/answer', quizController.answer);

/* GET authors page. */
router.get('/author', authorController.author);

module.exports = router;
