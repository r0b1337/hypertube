const router = require("express").Router();
const movie_controller = require("../controllers/movies.controller");

router.post("/search"				, movie_controller.search);
router.post("/suggestions"			, movie_controller.suggestions);
router.post("/details"				, movie_controller.details);
router.post("/random"				, movie_controller.random);
router.post("/comment"				, movie_controller.comment);
router.post("/view"					, movie_controller.view);
router.get("/stream/:imdb_id"		, movie_controller.stream);
router.post("/suggestions_by_genre"	, movie_controller.suggestions_by_genre);
router.post("/update"				, movie_controller.update_movie_expiration_date);

module.exports = router;
