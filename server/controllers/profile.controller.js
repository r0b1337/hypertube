const db = require("../utils/db");
const check = require("../utils/check");
const log = require("../utils/log");

exports.root = async (req, res) => {

	let user_id = req.session.user_id;
	let target_id = req.params.user_id;

	if (!user_id || isNaN(target_id)) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}

	try {

		let check_uid = await check.user_id(target_id);
		if (!check_uid || !check_uid.length) {
			res.status(400).json({ "status": 400, "message": "bad parameters" });
			return ;
		}

		let rets = ["username", "firstname", "lastname", "image", "language"];
		let data = await db.select(rets, "users", ["id"], [target_id]);
		data[0].viewed = await db.select(["imdb_id", "title", "date"], "viewed", ["user_id"], [target_id]);
		res.status(200).json({ "status": 200, "message": "ok", "profile": data });

	} catch (error) {

		log(5, "hypertube-server", "profile.controller.js", error.message);
		res.status(500).json({ "status": 500, "message": "internal server error" });
	
	}

};
