const router = require("express").Router();
const subtitles_controller = require("../controllers/subtitles.controller");

router.get("/search/:imdbid/:languageid", subtitles_controller.search);

module.exports = router;
