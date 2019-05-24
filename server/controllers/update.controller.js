const bcrypt = require("bcryptjs");

const db = require("../utils/db");
const validate = require("../utils/validate");
const check = require("../utils/check");
const mail = require("../utils/mail");
const log = require("../utils/log");

exports.root = async (req, res) => {

	let user_id = req.session.user_id;
	let username = req.body.username;
	let firstname = req.body.firstname;
	let lastname = req.body.lastname;
	let language = req.body.language;

	if (!user_id) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}	

	try {

		if (username) {
			let check_username = await check.username(username);
			if (check_username && check_username.length) {
				res.status(400).json({ "status": 400, "message": "username already in use" });
				return ;
			}
		}

		let cols = [ "username", "firstname", "lastname", "language" ];
		let vals = [
			validate.username(username) ? username : undefined,
			validate.firstname(firstname) ? firstname : undefined,
			validate.lastname(lastname) ? lastname : undefined,
			validate.language(language) ? language : undefined
		];

		for (let i = 0; i < vals.length; i++) {
			if (vals[i] !== undefined)
				await db.update("users", cols[i], vals[i], "id", user_id);
		}

		res.status(200).json({ "status": 200, "message": "ok" });

	} catch (error) {

		log(5, "hypertube-server", "update.controller.js", error.message);
		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};

exports.password = async (req, res) => {

	let user_id = req.session.user_id;
	let old_password = req.body.old_password;
	let new_password = req.body.new_password;

	if (!user_id || !old_password || !new_password) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}

	try {

		let check_oauth = await check.oauth(user_id);
		if (check_oauth) {
			res.status(400).json({ "status": 400, "message": "can't update password (oauth)" });
			return ;
		}

		let user_data = await db.select(["password"], "users", ["id"], [user_id]);

		if (!bcrypt.compareSync(old_password, user_data[0].password)) {
			res.status(400).json({ "status": 400, "message": "wrong password" });
			return ;
		}
		
		if (!validate.password(new_password)) {
			res.status(400).json({ "status": 400, "message": "invalid password" });
			return ;
		}

		let hash = bcrypt.hashSync(new_password, 10);
		await db.update("users", "password", hash, "id", user_id);

		res.status(200).json({ "status": 200, "message": "ok" });

	} catch (error) {

		log(5, "hypertube-server", "update.controller.js", error.message);
		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};

exports.email = async (req, res) => {

	let user_id = req.session.user_id;
	let new_email = req.body.new_email;

	if (!user_id || !new_email) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}

	try {

		if (!validate.email(new_email)) {
			res.status(400).json({ "status": 400, "message": "invalid e-mail address" });
			return ;
		}

		let check_email = await check.email(new_email);
		if (check_email && check_email.length) {
			res.status(400).json({ "status": 400, "message": "account with given details exists" });
			return ;
		}

		await db.update("users", "email", new_email, "id", user_id);
		await db.update("users", "status", false, "id", user_id);
		await mail.confirm_account(new_email);

		res.status(200).json({ "status": 200, "message": "ok" });

	} catch (error) {

		log(5, "hypertube-server", "update.controller.js", error.message);
		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};
