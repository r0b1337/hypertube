const bcrypt = require("bcryptjs");
const db = require("../utils/db");
const log = require("../utils/log");
const check = require("../utils/check");
const validate = require("../utils/validate");
const mail = require("../utils/mail");

exports.local = async (username, password, callback) => {

	if (!username || !password) {
		return callback(null, false, { "message": "missing parameters" });
	}

	try {

		var data = await db.select(["id", "status", "password"], "users", ["username"], [username]);
		if (!data || !data.length || !data[0].id) {
			return callback(null, false, { "message": "incorrect username" });
		} else if (data[0].status === 0) {
			return callback(null, false, { "message": "e-mail not confirmed" });
		}

		if (!bcrypt.compareSync(password, data[0].password)) {
			return callback(null, false, { "message": "incorrect password" });
		}

		return callback(null, data[0].id);

	} catch (error) {

		log(5, "hypertube-server", "strategy.controller.js", error);
		return callback(error);

	}

};

exports.fortytwo = async (accessToken, refreshToken, profile, callback) => {

	if (!accessToken || !refreshToken) {
		return callback(null, false, { "message": "missing parameters" });
	}

	try {

		var data = await db.select(["id", "id_oauth_42", "status"], "users", ["id_oauth_42"], [profile.id]);

		//	console.log(JSON.stringify(profile, null, 4));

		if (!data || !data.length || !data[0].id) {

			let id_oauth_42 = profile.id;
			let email = profile.emails[0].value;
			let username = profile.username;
			let firstname = profile.name.givenName;
			let lastname = profile.name.familyName;
			let image = profile.photos[0].value;

			if (!validate.email(email)) {
				return callback(null, false, { "message": "invalid e-mail address" });
			}

			if (!validate.username(username)) {
				return callback(null, false, { "message": "invalid username" });
			}

			if (!validate.firstname(firstname) || !validate.lastname(lastname)) {
				return callback(null, false, { "message": "invalid firstname/lastname" });
			}

			let check_username = await check.username(username);
			let check_email = await check.email(email);
			if (check_username && check_username.length || check_email && check_email.length) {
				return callback(null, false, { "message": "account with given details exists" });
			}

			let cols = ["id_oauth_42", "email", "username", "firstname", "lastname", "image", "status", "language"];
			let vals = [id_oauth_42, email, username, firstname, lastname, image, true, "en"];
			data = await db.insert("users", cols, vals);

			log(3, "hypertube-server", "strategy.controller.js", `new user registered [from 42] > ${username}:${id_oauth_42}`);
			return callback(null, data.insertId);

		} else {

			if (data[0].status === 0)
				return callback(null, false, { "message": "e-mail not confirmed" });
			return callback(null, data[0].id);

		}

	} catch (error) {

		log(5, "hypertube-server", "strategy.controller.js", error);
		return callback(error);

	}

};

exports.google = async (accessToken, refreshToken, profile, callback) => {

	if (!profile) {
		return callback(null, false, { "message": "missing parameters" });
	}

	try {

		var data = await db.select(["id", "id_oauth_google", "status"], "users", ["id_oauth_google"], [profile.id]);

		//	console.log(JSON.stringify(profile, null, 4));

		if (!data || !data.length || !data[0].id) {

			let id_oauth_google = profile.id;
			let email = profile.emails[0].value;
			let firstname = profile.name.givenName;
			let lastname = profile.name.familyName;
			let username = `${firstname[0]}${lastname}`.toLowerCase();
			let image = profile.photos[0].value;

			if (!validate.email(email)) {
				return callback(null, false, { "message": "invalid e-mail address" });
			}

			if (!validate.username(username)) {
				return callback(null, false, { "message": "invalid username" });
			}

			if (!validate.firstname(firstname) || !validate.lastname(lastname)) {
				return callback(null, false, { "message": "invalid firstname/lastname" });
			}

			let check_username = await check.username(username);
			let check_email = await check.email(email);
			if (check_username && check_username.length || check_email && check_email.length) {
				return callback(null, false, { "message": "account with given details exists" });
			}

			let cols = ["id_oauth_google", "email", "username", "firstname", "lastname", "image", "status", "language"];
			let vals = [id_oauth_google, email, username, firstname, lastname, image, true, "en"];
			data = await db.insert("users", cols, vals);

			log(3, "hypertube-server", "strategy.controller.js", `new user registered [from google] > ${username}:${id_oauth_google}`);
			return callback(null, data.insertId);

		} else {

			if (data[0].status === 0)
				return callback(null, false, { "message": "e-mail not confirmed" });
			return callback(null, data[0].id);

		}

	} catch (error) {

		log(5, "hypertube-server", "strategy.controller.js", error);
		return callback(error);

	}

};

exports.github = async (accessToken, refreshToken, profile, callback) => {

	if (!profile) {
		return callback(null, false, { "message": "missing parameters" });
	}

	try {

		var data = await db.select(["id", "id_oauth_github", "status"], "users", ["id_oauth_github"], [profile.id]);

		//	console.log(JSON.stringify(profile, null, 4));

		if (!data || !data.length || !data[0].id) {

			let id_oauth_github = profile.id;
			let username = profile.username || profile._json.login;
			let email = profile._json.email || `${username}@users.noreply.github.com`;
			let firstname = "Anon";
			let lastname = "Ymous";
			let image = profile.photos[0].value || profile._json.avatar_url;

			if (!validate.email(email)) {
				return callback(null, false, { "message": "invalid e-mail address" });
			}

			if (!validate.username(username)) {
				return callback(null, false, { "message": "invalid username" });
			}

			if (!validate.firstname(firstname) || !validate.lastname(lastname)) {
				return callback(null, false, { "message": "invalid firstname/lastname" });
			}

			let check_username = await check.username(username);
			let check_email = await check.email(email);
			if (check_username && check_username.length || check_email && check_email.length) {
				return callback(null, false, { "message": "account with given details exists" });
			}

			let cols = ["id_oauth_github", "email", "username", "firstname", "lastname", "image", "status", "language"];
			let vals = [id_oauth_github, email, username, firstname, lastname, image, true, "en"];
			data = await db.insert("users", cols, vals);

			log(3, "hypertube-server", "strategy.controller.js", `new user registered [from github] > ${username}:${id_oauth_github}`);
			return callback(null, data.insertId);

		} else {

			if (data[0].status === 0)
				return callback(null, false, { "message": "e-mail not confirmed" });
			return callback(null, data[0].id);

		}

	} catch (error) {

		log(5, "hypertube-server", "strategy.controller.js", error);
		return callback(error);

	}

};
