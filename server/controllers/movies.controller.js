const fs = require("fs");
const moment = require("moment");
const _path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const pump = require("pump");

const config = require("../config");
const popcorntimeApi = require("../utils/popcorntime-api");
const ytsApi = require("../utils/yts-api");
const db = require("../utils/db");
const validate = require("../utils/validate");
const check = require("../utils/check");
const log = require("../utils/log");
const movie = require("../utils/movie");

exports.search = async (req, res) => {

	let user_id = req.session.user_id;
	let keywords = req.body.keywords;
	let page = req.body.page;

	if (!user_id || !keywords || !page) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}

	try {

		let results_1 = await popcorntimeApi.search(keywords, page);
		let results_2 = await ytsApi.search(keywords, page);

		if (results_1 === null || results_2 === null) {
			res.status(400).json({ "status": 400, "message": "one or both APIs encoutered an error" });
			return ;
		}

		let data = results_2.slice();
		for (let i = 0; i < results_1.length; i++) {
			if (!data.some((o) => o.imdb_id === results_1[i].imdb_id))
				data.push(results_1[i]);
		}

		res.status(200).json({ "status": 200, "message": "ok", "data": data });

	} catch (error) {

		log(5, "hypertube-server", "movies.controller.js", error.message);
		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};

exports.suggestions = async (req, res) => {

	let user_id = req.session.user_id;
	let page = req.body.page;

	if (!user_id || !page) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}

	try {

		let result = await ytsApi.suggestions(page);

		if (result === null) {
			res.status(400).json({ "status": 400, "message": "one or both APIs encoutered an error" });
			return ;
		}

		res.status(200).json({ "status": 200, "message": "ok", "data": result });

	} catch (error) {

		log(5, "hypertube-server", "movies.controller.js", error.message);
		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};

exports.random = async (req, res) => {

	let user_id = req.session.user_id;

	if (!user_id) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}

	try {

		let result = await popcorntimeApi.random();

		if (result === null) {
			res.status(400).json({ "status": 400, "message": "one or both APIs encoutered an error" });
			return ;
		}

		res.status(200).json({ "status": 200, "message": "ok", "data": result });

	} catch (error) {

		log(5, "hypertube-server", "movies.controller.js", error.message);
		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};

exports.details = async (req, res) => {

	let user_id = req.session.user_id;
	let imdb_id = req.body.imdb_id;

	if (!user_id || !imdb_id) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}

	try {

		let result = await movie.details(imdb_id);
		if (!result) {
			res.status(400).json({ "status": 400, "message": "one or both APIs encoutered an error" });
			return ;	
		}

		if (Object.keys(result).length === 0) {
			res.status(404).json({ "status": 404, "message": "imdb_id not found" });
			return ;
		}

		result.comments = await db.select(["user_id", "username", "comment", "date", "rating"], "comments", ["imdb_id"], [imdb_id]);
		res.status(200).json({ "status": 200, "message": "ok", "data": result });

		await movie.delete_old_movies();

	} catch (error) {

		log(5, "hypertube-server", "movies.controller.js", error.message);
		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};

exports.comment = async (req, res) => {

	let user_id = req.session.user_id;
	let imdb_id = req.body.imdb_id;
	let comment = req.body.comment;
	let rating = req.body.rating;

	if (!user_id || !imdb_id || !comment) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}

	try {
	
		if (!validate.comment(comment)) {
			res.status(400).json({ "status": 400, "message": "comment is too long" });
			return ;
		}

		if (!validate.rating(rating)) {
			res.status(400).json({ "status": 400, "message": "rating is incorrect" });
			return ;
		}

		let check_comment = await db.select(["date"], "comments", ["user_id", "imdb_id"], [user_id, imdb_id]);
		if (check_comment && check_comment.length) {
			res.status(400).json({ "status": 400, "message": `already commented this movie` });
			return ;
		}

		let username = await db.select(["username"], "users", ["id"], [user_id]);
		if (!username[0].username || !username[0].username.length) {
			res.status(400).json({ "status": 400, "message": `Impossible to find the username` });
			return ;
		}
		
		await db.insert("comments", ["user_id", "imdb_id", "username", "comment", "rating"], [user_id, imdb_id, username[0].username, comment, rating]);
		res.status(200).json({ "status": 200, "message": "ok" });

	} catch (error) {

		log(5, "hypertube-server", "movies.controller.js", error.message);
		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};

exports.view = async (req, res) => {

	let user_id = req.session.user_id;
	let title = req.body.title;
	let imdb_id = req.body.imdb_id;

	if (!user_id || !title || !imdb_id) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}

	try {

		let check_view = await db.select([], "viewed", ["user_id", "imdb_id"], [user_id, imdb_id]);
		if (!check_view || !check_view.length)
			await db.insert("viewed", ["user_id", "imdb_id", "title"], [user_id, imdb_id, title]);

		res.status(200).json({ "status": 200, "message": "ok" });

	} catch (error) {

		log(5, "hypertube-server", "movies.controller.js", error.message);
		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};

/*
**	https://stackoverflow.com/a/24977085
**	https://stackoverflow.com/a/39056085
*/

exports.stream = async (req, res) => {

	let user_id = req.session.user_id;
	let imdb_id = req.params.imdb_id;
	let content_range = req.headers.range;

	if (!imdb_id) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}

	if (!content_range) {
		res.sendStatus(416);
		return ;
	}

	try {

    	const valid_extensions = [".mp4", ".ogg", ".ogv", ".webm"];
		const data_from_db = await check.movie(imdb_id);

		if (!data_from_db || !data_from_db.length) {

			const data_from_api = await movie.details(imdb_id);
			if (!data_from_api) {
				res.status(400).json({ "status": 400, "message": "one or both APIs encoutered an error" });
				return ;	
			}

			movie.download(data_from_api, (file) => {
			
				if (!file) {
					res.status(400).json({ "status": 400, "message": "error while trying to stream" });
					return ;
				}

				res.writeHead(200, {
					"Content-Length": file.length,
					"Content-Type": "video/webm"
				});

				let stream = file.createReadStream();
				log(3, "hypertube-server", "movies.controller.js", `streaming "${file.name}"...`);

				if (!valid_extensions.includes(_path.extname(file.name))) {
					ffmpeg(stream)
						.on("start", () => log(3, "hypertube-server", "movies.controller.js", "conversion started..."))
						.on("error", (error) => log(5, "hypertube-server", "movies.controller.js", error.message))
						.format("webm")
						.audioBitrate(128)
						.audioCodec("libvorbis")
						.videoBitrate(1024)
						.videoCodec("libvpx")
						.stream()
						.pipe(res);
					return ;
				}

				stream.on("error", (error) => log(5, "hypertube-server", "movies.controller.js", error.message));
				pump(stream, res);

			});

		} else {

			let [{ path, title }] = await db.select(["path", "title"], "movies", ["imdb_id"], [imdb_id]);
			let file_size = fs.statSync(path).size;
			let parts = content_range.replace(/bytes=/, "").split("-");
			let start = parseInt(parts[0], 10);
			let end = parts[1] ? parseInt(parts[1], 10) : file_size - 1;
			let chunk_size = (end - start) + 1;
			let max_chunk = 1024 * 1024; // 1mb at a time

			if (chunk_size > max_chunk) {
				end = start + max_chunk - 1;
				chunk_size = (end - start) + 1;
			}

			res.writeHead(206, {
				"Content-Range": `bytes ${start}-${end}/${file_size}`,
				"Accept-Ranges": "bytes",
				"Content-Length": chunk_size,
				"Content-Type": "video/webm"
			});

			let stream = fs.createReadStream(path, { start, end, "autoClose": true });
			log(3, "hypertube-server", "movies.controller.js", `streaming "${title}"...`);

			if (!valid_extensions.includes(_path.extname(path))) {
				ffmpeg(stream)
					.on("start", () => log(3, "hypertube-server", "movies.controller.js", "conversion started..."))
					.on("error", (error) => log(5, "hypertube-server", "movies.controller.js", error.message))
					.format("webm")
					.audioBitrate(128)
					.audioCodec("libvorbis")
					.videoBitrate(1024)
					.videoCodec("libvpx")
					.stream()
					.pipe(res);
				return ;
			}

			stream.on("error", (error) => log(5, "hypertube-server", "movies.controller.js", error.message));
			pump(stream, res);

		}

	} catch (error) {

		log(5, "hypertube-server", "movies.controller.js", error.message);
		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};

exports.suggestions_by_genre = async (req, res) => {

	let user_id = req.session.user_id;
	let api = req.body.api;
	let genres = req.body.genres;

	if (!user_id || !api || !genres) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}

	try {

		let genre = genres.split(";").filter(() => Math.round(Math.random()));
		let data = [];

		if (api === "yts") {
			data = await ytsApi.suggestions_by_genre(genre);
		} else if (api === "popcorntime") {
			data = await popcorntimeApi.suggestions_by_genre(genre);
		} else {
			res.status(400).json({ "status": 400, "message": "wrong api name parameter" });
			return ;
		}

		res.status(200).json({ "status": 200, "message": "ok", "data": data });
	
	} catch (error) {

		log(5, "hypertube-server", "movies.controller.js", error.message);
		res.status(500).json({ "status": 500, "message": "internal server error" });
	
	}

};

exports.update_movie_expiration_date = async (req, res) => {

	let user_id = req.session.user_id;
	let imdb_id = req.body.imdb_id;

	if (!user_id || !imdb_id) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}

	try {

		let check_movie = await check.movie(imdb_id);
		if (!check_movie || !check_movie.length) {
			res.status(400).json({ "status": 400, "message": "movie not found in database" });
			return ;
		}

		let new_exp_date = moment().add(1, "month").format("YYYY-MM-DD HH:mm:ss");
		await db.update("movies", "expiration_date", new_exp_date, "imdb_id", imdb_id);

		log(3, "hypertube-server", "utils/movie.js", "movie already downloaded -- updated expiration date");
		res.status(200).json({ "status": 200, "message": "ok" });
	
	} catch (error) {

		log(5, "hypertube-server", "movies.controller.js", error.message);
		res.status(500).json({ "status": 500, "message": "internal server error" });
	
	}

};
