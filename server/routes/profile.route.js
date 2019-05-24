const router = require("express").Router();
const profile_controller = require("../controllers/profile.controller");

router.post("/:user_id", profile_controller.root);

module.exports = router;
