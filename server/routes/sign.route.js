const router = require("express").Router();
const sign_controller = require("../controllers/sign.controller");

router.post("/up"				, sign_controller.up);
router.post("/out"				, sign_controller.out);
router.post("/local"			, sign_controller.local);
router.get("/42"				, sign_controller.fortytwo);
router.get("/42/callback"		, sign_controller.fortytwo.callback);
router.get("/google"			, sign_controller.google);
router.get("/google/callback"	, sign_controller.google.callback);
router.get("/github"			, sign_controller.github);
router.get("/github/callback"	, sign_controller.github.callback);

module.exports = router;
