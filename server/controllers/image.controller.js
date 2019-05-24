const crypto = require("crypto");
const fs = require("fs");

const db = require("../utils/db");
const validate = require("../utils/validate");
const check = require("../utils/check");
const config = require("../config");
const log = require("../utils/log");

exports.root = (req, res) => {

	let file_name = req.params.file_name;

	if (!file_name) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}

	res.sendFile(`${config.path}/imgs/${file_name}`, (error) => {
		if (error) {
			log(5, "hypertube-server", "images.controller.js", error.message);
			res.status(404).json({ "status": 404, "message": "not found" });
		}
	});

};

exports.upload = async (req, res) => {

	let user_id = req.session.user_id;
	let image = req.body.image;

	if (!user_id || !image) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}

	try {

		if (!validate.image(image)) {
			res.status(400).json({ "status": 400, "message": "not a valid image file" });
			return ;
		}

		let regexp = /^data:image\/(.*);base64/gi;
		let ext = regexp.exec(image)[1];
		// generate random name and remove header from file
		let random_name = `uu-${crypto.randomBytes(16).toString("hex")}.${ext}`;
		image = image.replace(/^data:image\/\w+;base64,/, "");

		// create directory if doesn't exist and save image there
		if (!fs.existsSync("./imgs")) fs.mkdirSync("./imgs");
		fs.writeFileSync(`./imgs/${random_name}`, Buffer.from(image, "base64"));

		// update user's data to insert image url
		let img_url = `${config.host}:${config.ports.server}/image/${random_name}`;
		await db.update("users", "image", img_url, "id", user_id);

		res.status(200).json({ "status": 200, "message": "ok" });

	} catch (error) {

		log(5, "hypertube-server", "images.controller.js", error.message);
		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};

exports.delete = async (req, res) => {

	let user_id = req.session.user_id;

	if (!user_id) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}

	try {

		let dpp_url = `${config.host}:${config.ports.server}/images/${config.default_picture}`;
		await db.update("users", "image", dpp_url, "id", user_id);
		res.status(200).json({ "status": 200, "message": "ok" });

	} catch (error) {

		log(5, "hypertube-server", "images.controller.js", error.message);
		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};
