const passport = require("passport");
const bcrypt = require("bcryptjs");
const qs = require("querystring");
const crypto = require("crypto");
const fs = require("fs");

const config = require("../config");
const db = require("../utils/db");
const validate = require("../utils/validate");
const mail = require("../utils/mail");
const check = require("../utils/check");
const log = require("../utils/log");

exports.up = async (req, res) => {

	let email = req.body.email;
	let username = req.body.username;
	let password = req.body.password;
	let firstname = req.body.firstname;
	let lastname = req.body.lastname;
	let image = req.body.image;

	if (!email || !username || !password || !firstname || !lastname || !image) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}

	try {

		if (!validate.email(email)) {
			res.status(400).json({ "status": 400, "message": "invalid e-mail address" });
			return ;
		}

		if (!validate.username(username)) {
			res.status(400).json({ "status": 400, "message": "invalid username" });
			return ;
		}

		if (!validate.password(password)) {
			res.status(400).json({ "status": 400, "message": "invalid password" });
			return ;
		}

		if (!validate.firstname(firstname) || !validate.lastname(lastname)) {
			res.status(400).json({ "status": 400, "message": "invalid firstname/lastname" });
			return ;
		}

		if (!validate.image(image)) {
			res.status(400).json({ "status": 400, "message": "not a valid image file" });
			return ;
		}

		let check_username = await check.username(username);
		let check_email = await check.email(email);
		if (check_username && check_username.length || check_email && check_email.length) {
			res.status(400).json({ "status": 400, "message": "account with given details exists" });
			return;
		}

		let regexp = /^data:image\/(.*);base64/gi;
		let ext = regexp.exec(image)[1];
		// generate random name and remove header from file
		let random_name = `uu-${crypto.randomBytes(16).toString("hex")}.${ext}`;
		image = image.replace(/^data:image\/\w+;base64,/, "");

		// create directory if doesn't exist and save image there
		if (!fs.existsSync("./imgs")) fs.mkdirSync("./imgs");
		fs.writeFileSync(`./imgs/${random_name}`, Buffer.from(image, "base64"));

		let img_url = `${config.host}:${config.ports.server}/image/${random_name}`;
		let hash = bcrypt.hashSync(password, 10);
		let cols = ["email", "username", "password", "firstname", "lastname", "image", "language"];
		let vals = [email, username, hash, firstname, lastname, img_url, "en"];
		await db.insert("users", cols, vals);

		await mail.confirm_account(email);
		
		log(3, "hypertube-server", "sign.controller.js", `new user registered > ${username}:${password}`);
		res.status(200).json({ "status": 200, "message": "ok" });

	} catch (error) {

		log(5, "hypertube-server", "sign.controller.js", error.message);
		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};

exports.out = (req, res) => {

	if (!req.session.user_id) {
		res.status(400).json({ "status": 400, "message": "not logged in" });
		return ;
	}

	req.session.user_id = null;
	res.status(200).json({ "status": 200, "message": "ok" });

};

exports.local = (req, res) => {

	if (req.session.user_id) {
		res.status(400).json({ "status": 400, "message": "already logged in" });
		return ;
	}

	passport.authenticate("local", (error, data, info) => {
	
		if (error) {
			log(5, "hypertube-server", "sign.controller.js", error.message);
			res.status(500).json({ "status": 500, "message": "internal server error" });
			return ;
		}
	
		if (!data) {
			res.status(400).json({ "status": 400, "message": info.message });
			return ;
		}

		req.session.user_id = data;
		res.status(200).json({ "status": 200, "message": "ok", "id": req.session.user_id });

	})(req, res);

};

exports.fortytwo = (req, res) => {

	if (req.session.user_id) {
		res.redirect(`${config.host}:${config.ports.client}/redirect?${qs.stringify(
			{ "status": 400, "message": "already logged in" }
		)}`);
		return ;
	}

	passport.authenticate("42")(req, res);

};

exports.fortytwo.callback = (req, res) => {

	if (req.session.user_id) {
		res.redirect(`${config.host}:${config.ports.client}/redirect?${qs.stringify(
			{ "status": 400, "message": "already logged in" }
		)}`);
		return ;
	}

	passport.authenticate("42", (error, data, info) => {

		if (error) {
			log(5, "hypertube-server", "sign.controller.js", error.message);
			res.redirect(`${config.host}:${config.ports.client}/redirect?${qs.stringify(
				{ "status": 500, "message": "internal server error" }
			)}`);
			return ;
		}

		if (!data) {
			res.redirect(`${config.host}:${config.ports.client}/redirect?${qs.stringify(
				{ "status": 400, "message": info.message }
			)}`);
			return ;
		}

		req.session.user_id = data;
		res.redirect(`${config.host}:${config.ports.client}/redirect?${qs.stringify(
			{ "status": 200, "message": "signed in" }
		)}`);

	})(req, res);

};

exports.google = (req, res) => {

	if (req.session.user_id) {
		res.redirect(`${config.host}:${config.ports.client}/redirect?${qs.stringify(
			{ "status": 400, "message": "already logged in" }
		)}`);
		return ;
	}

	passport.authenticate("google", { "scope": ["profile", "email"] })(req, res);

};

exports.google.callback = (req, res) => {

	if (req.session.user_id) {
		res.redirect(`${config.host}:${config.ports.client}/redirect?${qs.stringify(
			{ "status": 400, "message": "already logged in" }
		)}`);
		return ;
	}

	passport.authenticate("google", { "scope": ["profile", "email"] }, (error, data, info) => {

		if (error) {
			log(5, "hypertube-server", "sign.controller.js", error.message);
			res.redirect(`${config.host}:${config.ports.client}/redirect?${qs.stringify(
				{ "status": 500, "message": "internal server error" }
			)}`);
			return ;
		}

		if (!data) {
			res.redirect(`${config.host}:${config.ports.client}/redirect?${qs.stringify(
				{ "status": 400, "message": info.message }
			)}`);
			return ;
		}

		req.session.user_id = data;
		res.redirect(`${config.host}:${config.ports.client}/redirect?${qs.stringify(
			{ "status": 200, "message": "signed in" }
		)}`);

	})(req, res);

};

exports.github = (req, res) => {

	if (req.session.user_id) {
		res.redirect(`${config.host}:${config.ports.client}/redirect?${qs.stringify(
			{ "status": 400, "message": "already logged in" }
		)}`);
		return ;
	}

	passport.authenticate("github", { "scope": ["user"] })(req, res);

};

exports.github.callback = (req, res) => {

	if (req.session.user_id) {
		res.redirect(`${config.host}:${config.ports.client}/redirect?${qs.stringify(
			{ "status": 400, "message": "already logged in" }
		)}`);
		return ;
	}

	passport.authenticate("github", { "scope": ["user"] }, (error, data, info) => {

		if (error) {
			log(5, "hypertube-server", "sign.controller.js", error.message);
			res.redirect(`${config.host}:${config.ports.client}/redirect?${qs.stringify(
				{ "status": 500, "message": "internal server error" }
			)}`);
			return ;
		}

		if (!data) {
			res.redirect(`${config.host}:${config.ports.client}/redirect?${qs.stringify(
				{ "status": 400, "message": info.message }
			)}`);
			return ;
		}

		req.session.user_id = data;
		res.redirect(`${config.host}:${config.ports.client}/redirect?${qs.stringify(
			{ "status": 200, "message": "signed in" }
		)}`);

	})(req, res);

};
