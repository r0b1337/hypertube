const axios = require("axios");
const qs = require("qs");
const log = require("./log");

/*
**	------------------------------------------------------------------------- **
**
**	Docs:
**	- https://yts.am/api
**
**	Endpoints:
**	- base URL			| GET https://yts.am/api/v2
**	- search a movie	| GET /list_movies.json?page=1&limit=50&sort_by=year&order_by=asc&query_term=spider+man
**	- get movie details	| GET /list_movies.json?&query_term=tt0145487
**
**	------------------------------------------------------------------------- **
*/

const BASE_URL = "https://yts.am/api/v2";

/*
**	@params		{string}	-- keywords that match a movie's title
**	@params		{int}		-- page number
**	@ret		{array}		-- 0 or more object(s) that contain movie's data & informations
**	@onerror	{null}		-- + error is logged to stderr
*/

exports.search = async (keywords, page) => {

	try {

		let params = { "page": page, "limit": 50, "sort_by": "year", "order_by": "desc", "query_term": keywords };
		let response = await axios.get(`${BASE_URL}/list_movies.json?${qs.stringify(params)}`);

		if (!response.data.data.movies)
			return [];
		
		return response.data.data.movies.map((movie) => {
			return {
				"imdb_id": movie.imdb_code,
				"title": movie.title,
				"year": movie.year,
				"synopsis": movie.synopsis || movie.summary || movie.description_full,
				"runtime": movie.runtime,
				"genres": movie.genres ? movie.genres.join(";").toLowerCase() : null,
				"image": movie.large_cover_image || movie.medium_cover_image,
				"rating": movie.rating,
				"api": "yts"
			};
		});

	} catch (error) {

		log(5, "hypertube-server", "yts-api.js", error.message);
		return null;

	}

};

/*
**	@params		{int}		-- page number
**	@ret		{array}		-- 0 or more object(s) that contain movie's data & informations
**	@onerror	{null}		-- + error is logged to stderr
*/

exports.suggestions = async (page) => {

	try {

		let params = { "page": page, "limit": 15, "sort_by": "download_count", "order_by": "desc" };
		let response = await axios.get(`${BASE_URL}/list_movies.json?${qs.stringify(params)}`);

		if (!response.data.data.movies)
			return [];
		
		return response.data.data.movies.map((movie) => {
			return {
				"imdb_id": movie.imdb_code,
				"title": movie.title,
				"year": movie.year,
				"synopsis": movie.synopsis || movie.summary || movie.description_full,
				"runtime": movie.runtime,
				"genres": movie.genres ? movie.genres.join(";").toLowerCase() : null,
				"image": movie.large_cover_image || movie.medium_cover_image,
				"rating": movie.rating
			};
		});

	} catch (error) {

		log(5, "hypertube-server", "yts-api.js", error.message);
		return null;

	}

};

/*
**	@params		{string}	-- movie genre
**	@ret		{array}		-- 10 object(s) that contain movie's data & informations
**	@onerror	{null}		-- + error is logged to stderr
*/

exports.suggestions_by_genre = async (genre) => {

	try {

		let params = { "page": 1, "limit": 10, "sort_by": "download_count", "order_by": "desc", "genre": genre };
		let response = await axios.get(`${BASE_URL}/list_movies.json?${qs.stringify(params)}`);

		if (!response.data.data.movies)
			return [];

		if (response.data.data.movies.length != 10) {
			params = { "page": 1, "limit": 10, "sort_by": "download_count", "order_by": "desc" };
			response = await axios.get(`${BASE_URL}/list_movies.json?${qs.stringify(params)}`);
		}
		
		return response.data.data.movies.map((movie) => {
			return {
				"imdb_id": movie.imdb_code,
				"title": movie.title,
				"year": movie.year,
				"synopsis": movie.synopsis || movie.summary || movie.description_full,
				"runtime": movie.runtime,
				"genres": movie.genres ? movie.genres.join(";").toLowerCase() : null,
				"image": movie.large_cover_image || movie.medium_cover_image,
				"rating": movie.rating
			};
		});

	} catch (error) {

		log(5, "hypertube-server", "yts-api.js", error.message);
		return null;

	}

};

/*
**	@params		{string}	-- imdb id of a movie
**	@ret		{object}	-- object that contain movie's data & informations (could be empty if not found)
**	@onerror	{null}		-- + error is logged to stderr
*/

exports.details = async (imdb_id) => {

	try {

		let params = { "page": 1, "limit": 1, "query_term": imdb_id };
		let response = await axios.get(`${BASE_URL}/list_movies.json?${qs.stringify(params)}`);

		if (response.data.data.movie_count < 1)
			return {};

		let movie = response.data.data.movies[0];
		let torrents = [];
		for (let i in movie.torrents) {
			torrents.push({
				"language": movie.language.toLowerCase() || null,
				"resolution": movie.torrents[i].quality,
				"file_size": movie.torrents[i].size_bytes,
				"size": movie.torrents[i].size_bytes,
				"magnet": `magnet:?xt=urn:btih:${movie.torrents[i].hash}&dn=${encodeURIComponent(movie.title)}` +
					"&tr=udp://glotorrents.pw:6969/announce" +
					"&tr=udp://tracker.opentrackr.org:1337/announce" +
					"&tr=udp://torrent.gresille.org:80/announce" +
					"&tr=udp://tracker.openbittorrent.com:80" +
					"&tr=udp://tracker.coppersurfer.tk:6969" +
					"&tr=udp://tracker.leechers-paradise.org:6969" +
					"&tr=udp://p4p.arenabg.com:1337" +
					"&tr=udp://open.demonii.com:1337/announce"
			});
		}

		return {
			"imdb_id": movie.imdb_code,
			"title": movie.title,
			"year": movie.year,
			"synopsis": movie.synopsis || movie.summary || movie.description_full,
			"runtime": movie.runtime,
			"genres": movie.genres ? movie.genres.join(";").toLowerCase() : null,
			"image": movie.large_cover_image || movie.medium_cover_image || movie.small_cover_image,
			"rating": movie.rating,
			"trailer": movie.yt_trailer_code ? `https://www.youtube.com/watch?v=${movie.yt_trailer_code}` : null,
			"torrents": torrents,
			"api": "yts"
		};

	} catch (error) {

		log(5, "hypertube-server", "yts-api.js", error.message);
		return null;

	}

};
