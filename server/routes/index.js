const router = require("express").Router();
const passport = require("passport");

router.use("/sign"			, require("./sign.route"));
router.use("/account"		, require("./account.route"));
router.use("/movies"		, require("./movies.route"));
router.use("/profile"		, require("./profile.route"));
router.use("/update"		, require("./update.route"));
router.use("/image"			, require("./image.route"));
router.use("/subtitles"		, require("./subtitles.route"));

module.exports = router;
