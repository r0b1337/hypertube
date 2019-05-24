const router = require("express").Router();
const image_controller = require("../controllers/image.controller");

router.get("/:file_name"	, image_controller.root);
router.post("/"				, image_controller.upload);
router.delete("/"			, image_controller.delete);

module.exports = router;
