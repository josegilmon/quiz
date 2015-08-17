
var Sequelize = require("sequelize");
var models = require("../models/models.js");

// Autoload de Quiz
exports.load = function (req, res, next, quizId) {
	models.Quiz.find({
		where: {
			id: Number(quizId)
		},
		include: [{
			model: models.Comment
		}]
	}).then(
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

// GET /quizes
exports.index = function (req, res) {
	var _search = req.query.search ? "%" + req.query.search.replace(/ /g, "%") + "%" : "%%";
	models.Quiz.findAll( { where: ["pregunta like ?", _search] } ).then(
		function (quizes) {
			res.render('quizes/index', { quizes: quizes, errors: [] });
		}
	).catch(function (error) { next(error); });
};

// GET /quizes/question
exports.show = function (req, res) {
	res.render('quizes/show', { quiz: req.quiz, errors: [] });
};

// GET /quizes/answer
exports.answer = function (req, res) {
	var resultado = req.query &&
			req.query.respuesta &&
			req.query.respuesta.toUpperCase() === req.quiz.respuesta.toUpperCase() ? "Correcto"	: "Incorrecto";

	res.render('quizes/answer', {
		quiz: req.quiz,
		respuesta: resultado,
		errors: []
	});
};

// GET /quizes/new
exports.new = function (req, res) {
	var quiz = models.Quiz.build({
		pregunta: "",
		respuesta: "",
		categoria: ""
	});
	res.render('quizes/new', { quiz: quiz, errors: [] });
};

// POST /quizes/create
exports.create = function (req, res) {
	var quiz = models.Quiz.build( req.body.quiz );
	quiz
		.validate()
		.then(function (err) {
			if (err) {
				res.render("quizes/new", { quiz: quiz, errors: err.errors });
			} else {
				quiz
					.save({fields: ["pregunta", "respuesta", "categoria"]})
					.then(function () {
						res.redirect("/quizes");
					});
			}
		});
};

// GET /quizes/edit
exports.edit = function (req, res) {
	var quiz = req.quiz;

	res.render('quizes/edit', { quiz: quiz, errors: [] });
};

// PUT /quizes/udpate
exports.update = function (req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.categoria = req.body.quiz.categoria;

	req.quiz
		.validate()
		.then( function (err) {
			if (err) {
				res.render('quizes/edit', { quiz: quiz, errors: err.errors });
			} else {
				req.quiz
					.save({ fields: ['pregunta', 'respuesta', 'categoria'] })
					.then( function () {
						res.redirect('/quizes');
					});
			}
		});
};

// DELETE /quizes/delete
exports.destroy = function (req, res) {
	req.quiz
		.destroy()
		.then(function () {
			res.redirect('/quizes');
		})
		.catch(function (error) { next(error); });
};


// GET /quizes/statistics
exports.statistics = function (req, res, next) {

	var estadisticas = {
		totalPreguntas: 0,
		totalComentarios: 0,
		mediaDeComentarios: 0,
		preguntasSinComentarios: 0,
		preguntasConComentarios: 0
	};

	models.Quiz.findAll()
		.then(function (quizes) {
			estadisticas.totalPreguntas = quizes.length;

			models.Comment.findAll()
				.then(function (comments) {
					estadisticas.totalComentarios = comments.length;

					estadisticas.mediaDeComentarios = comments.length / quizes.length;

					models.Quiz.findAll({
						include: [{
							model: models.Comment
						}]
					})
					.then(function (moreQuizes) {
						estadisticas.preguntasSinComentarios = estadisticas.totalPreguntas - moreQuizes.length;
						estadisticas.preguntasConComentarios = moreQuizes.length;

						res.render('quizes/statistics', { estadisticas: estadisticas, errors: [] });
					})
					.catch(function (error) { next(error); });

				})
				.catch(function (error) { next(error); });

		})
		.catch(function (error) { next(error); });
};
