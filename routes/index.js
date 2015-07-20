var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var authorController = require('../controllers/author_controller');

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Quiz', errors: [] });
});

router.param('quizId', quizController.load);

/* GET quiz pages */
router.get('/quizes', 						quizController.index);
router.get('/quizes/:quizId(\\d+)', 		quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',	quizController.answer);
router.get('/quizes/new',					quizController.new);
router.post('/quizes/create',				quizController.create);

router.get('/quizes/:quizId(\\d+)/edit',	quizController.edit);
router.put('/quizes/:quizId(\\d+)',			quizController.update);

/* GET authors page. */
router.get('/author', authorController.author);

module.exports = router;
