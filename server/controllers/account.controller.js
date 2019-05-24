const bcrypt = require("bcryptjs");

const db = require("../utils/db");
const mail = require("../utils/mail");
const validate = require("../utils/validate");
const check = require("../utils/check");
const log = require("../utils/log");

exports.confirm = async (req, res) => {

	let token = req.body.token;

	if (!token) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}

	try {

		let data = await db.select(null, "tokens", ["token"], [token]);
		if (data.length === 0 || data[0].type !== "email") {	
			res.status(400).json({ "status": 400, "message": "invalid token" });
			return ;
		}

		if (Date.parse(data[0].expiration_date) < Date.now()) {
			res.status(400).json({ "status": 400, "message": "token has expired" });
			return ;
		}

		await db.update("users", "status", true, "id", data[0].user_id);
		await db.delete("tokens", ["token"], [token]);

		log(3, "hypertube-server", "account.controller.js", `account confirmed for token '${token}'`);
		res.status(200).json({ "status": 200, "message": "ok" });

	} catch (error) {

		log(5, "hypertube-server", "account.controller.js", error.message);
		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};

exports.send_password_reset = async (req, res) => {

	let email = req.body.email;
	
	if (!email) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}

	try {

		let data = await db.select(["id", "email"], "users", ["email"], [email]);
		if (data.length === 0) {
			res.status(400).json({ "status": 400, "message": "no account linked to this email" });
			return ;
		}
	
		let check_oauth = await check.oauth(data[0].id);
		if (check_oauth) {
			res.status(400).json({ "status": 400, "message": "can't reset password (oauth)" });
			return ;
		}

		await mail.reset_password(email);
		res.status(200).json({ "status": 200, "message": "ok" });

	} catch (error) {

		log(5, "hypertube-server", "account.controller.js", error.message);
		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};

exports.reset_password = async (req, res) => {

	let token = req.body.token;
	let new_password = req.body.new_password;
	let confirm_password = req.body.confirm_password;

	if (!token || !new_password || !confirm_password) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}

	try {

		let data = await db.select(null, "tokens", ["token"], [token]);
		if (data.length === 0 || data[0].type !== "password") {	
			res.status(400).json({ "status": 400, "message": "invalid token" });
			return ;
		}

		if (Date.parse(data[0].expiration_date) < Date.now()) {
			res.status(400).json({ "status": 400, "message": "token has expired" });
			return ;
		}

		if (new_password !== confirm_password) {
			res.status(400).json({ "status": 400, "message": "passwords does not match" });
			return ;
		}

		if (!validate.password(new_password)) {
			res.status(400).json({ "status": 400, "message": "invalid password" });
			return ;
		}

		let hash = bcrypt.hashSync(new_password, 10);
		await db.update("users", "password", hash, "id", data[0].user_id);
		await db.delete("tokens", ["token"], [token]);

		res.status(200).json({ "status": 200, "message": "ok" });

	} catch (error) {

		log(5, "hypertube-server", "account.controller.js", error.message);
		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};

exports.session = async (req, res) => {

	let session_id = req.session.user_id;

	if (!session_id) {
		res.status(400).json({ "status": 400, "message": "invalid session" });
		return ;
	}
	
	res.status(200).json({ "status": 200, "message": "ok", "data": { "user_id": session_id } });

};
