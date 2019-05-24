const torrentStream = require("torrent-stream");
const moment = require("moment");

const config = require("../config");
const popcorntimeApi = require("./popcorntime-api");
const ytsApi = require("./yts-api");
const db = require("./db");
const validate = require("./validate");
const log = require("./log");

const storeMovieDetails = async (data, file) => {
	try {
		let cols = ["imdb_id", "path", "title", "year", "synopsis", "runtime",
					"genres", "image", "rating", "trailer", "size"];
		let vals = [
			data.imdb_id, `${config.path}/movies/${file.path}`, data.title, data.year, data.synopsis,
			data.runtime, data.genres, data.image, data.rating, data.trailer, file.length
		];
		await db.insert("movies", cols, vals);
	} catch (error) {
		throw new Error(error.message);
	}
};

const chooseTorrent = (torrents) => {
	if (torrents[0].size)
		return torrents.reduce((prev, curr) => prev.size < curr.size ? prev : curr);
	else
		return torrents[0];
};

exports.download = (data, callback) => {

	let name;

	const engine = torrentStream(chooseTorrent(data.torrents).magnet, {
		"connections": 3000,
		"path": `${config.path}/movies`
	});

	try {

		engine.on("ready", () => {
			engine.files.forEach(async (file) => {
				if (validate.extension(file.name)) {
					file.select();
					name = file.name;
					await storeMovieDetails(data, file);
					callback(file);
				} else {
					file.deselect();
					log(3, "hypertube-server", "utils/movie.js", `ignoring "${file.name}" (extension not supported)`);
				}
			});
		});

		engine.on("download", (index) => {
			console.log(`state for ${name}: ${index}`);
		});

		engine.on("idle", async () => {
			await db.update("movies", "download_status", true, "imdb_id", data.imdb_id);
			log(3, "hypertube-server", "utils/movie.js", `done downloading "${data.title}"`);
		});

		engine.once("destroyed", () => engine.removeAllListeners());

	} catch (error) {
	
		log(5, "hypertube-server", "utils/movie.js", error.message);
		callback(null);

	}

};

exports.details = async (imdb_id) => {
	try {
		let result_1 = await popcorntimeApi.details(imdb_id);
		let result_2 = await ytsApi.details(imdb_id);
		if (!result_1 || !result_2)
			return null;
		return Object.keys(result_1).length > Object.keys(result_2).length ? result_1 : result_2;
	} catch (error) {
		throw new Error(error.message);
		return null;
	}
};

exports.delete_old_movies = async () => {
	try {
		let data = await db.pool.query(`DELETE FROM \`movies\` WHERE \`expiration_date\` <= CURRENT_TIMESTAMP`);
		if (data.affectedRows > 0)
			log(3, "hypertube-server", "utils/movie.js", `removed ${data.affectedRows} movie(s) from database (date expired)`);
	} catch (error) {
		log(5, "hypertube-server", "utils/movie.js", error.message);
	}
};
