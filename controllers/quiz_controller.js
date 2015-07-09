// GET /quizes/question
exports.question = function (req, res) {
	res.render('quizes/question', { pregunta: "Capital de Italia" });
}


// GET /quizes/answer
exports.answer = function (req, res) {
	var resultado = (req.query && req.query.respuesta && req.query.respuesta.toUpperCase() === "ROMA") ? "Correcto": "Incorrecto";
	res.render('quizes/answer', { respuesta: resultado });
}
