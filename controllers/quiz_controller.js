
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

// GET /quizes/new
exports.new = function (req, res) {
	var quiz = models.Quiz.build({
		pregunta: "Pregunta",
		respuesta: "Respuesta"
	});
	res.render('quizes/new', { quiz: quiz });
};

// POST /quizes/create
exports.create = function (req, res) {
	var quiz = models.Quiz.build( req.body.quiz );
	quiz.save({fields: ["pregunta", "respuesta"]}).then(function () {
		res.redirect("/quizes");
	});
};
