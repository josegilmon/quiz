
var models = require("../models/models.js");

// GET /quizes/question
exports.question = function (req, res) {
	//res.render('quizes/question', { pregunta: "Capital de Italia" });
	models.Quiz.findAll().success(function (quiz) {
		res.render('quizes/question', { pregunta: quiz[0].pregunta });
	})
};

// GET /quizes/answer
exports.answer = function (req, res) {
	//var resultado = (req.query && req.query.respuesta && req.query.respuesta.toUpperCase() === "ROMA") ? "Correcto": "Incorrecto";
	models.Quiz.findAll().success(function (quiz) {
		var resultado = req.query && req.query.respuesta && req.query.respuesta.toUpperCase() === quiz[0].respuesta.toUpperCase()
			? "Correcto"
			: "Incorrecto"
			;
		res.render('quizes/answer', { respuesta: resultado });
	});
};
