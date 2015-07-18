
var models = require("../models/models.js");

exports.load = function (req, res, next, quizId) {
	models.Quiz.findById(quizId).then(
		function (quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else {
				next( new Error("No existe quizId = " + quizId) );
			}
		}
	).catch(function (error) { next(error); });
};

exports.index = function (req, res) {
	var _search = req.query.search
		? "%" + req.query.search.replace(/ /g, "%") + "%"
		: "%%"
		;
	models.Quiz.findAll( { where: ["pregunta like ?", _search] } ).then(
		function (quizes) {
			res.render('quizes/index', { quizes: quizes });
		}
	).catch(function (error) { next(error); });
};

// GET /quizes/question
exports.show = function (req, res) {
	res.render('quizes/show', { quiz: req.quiz });
};

// GET /quizes/answer
exports.answer = function (req, res) {
	var resultado = req.query && req.query.respuesta && req.query.respuesta.toUpperCase() === req.quiz.respuesta.toUpperCase()
		? "Correcto"
		: "Incorrecto"
		;
	res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado });
};
