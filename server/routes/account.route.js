const router = require("express").Router();
const account_controller = require("../controllers/account.controller");

router.post("/confirm"				, account_controller.confirm);
router.post("/send_password_reset"	, account_controller.send_password_reset);
router.post("/reset_password"		, account_controller.reset_password);
router.post("/session"				, account_controller.session);

module.exports = router;
