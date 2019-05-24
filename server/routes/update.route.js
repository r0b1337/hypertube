const router = require("express").Router();
const update_controller = require("../controllers/update.controller");

router.post("/"				, update_controller.root);
router.post("/password"		, update_controller.password);
router.post("/email"		, update_controller.email);

module.exports = router;
