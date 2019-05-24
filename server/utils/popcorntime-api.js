const axios = require("axios");
const qs = require("qs");
const ISO6391 = require("iso-639-1");
const log = require("./log");

/*
**	------------------------------------------------------------------------- **
**
**	Docs:
**	- https://popcorntime.api-docs.io/api/welcome/introduction
**	- https://popcornofficial.docs.apiary.io
**
**	Node module:
**	- https://popcorn-api.js.org
**	- https://github.com/nirewen/popcorn-api (github repo)
**
**	Endpoints:
**	- base URL			| GET https://tv-v2.api-fetch.website
**	- get status		| GET /status
**	- search a movie	| GET /movies/1?sort=year&order=1&keywords=spider+man
**	- get movie details	| GET /movie/tt0316654
**	- get random movie	| GET /random/movie
**
**	------------------------------------------------------------------------- **
*/

const BASE_URL = "https://tv-v2.api-fetch.website";

/*
**	@params		{string}	-- keywords that match a movie's title
**	@params		{int}		-- page number
**	@ret		{array}		-- 0 or more object(s) that contain movie's data & informations
**	@onerror	{null}		-- + error is logged to stderr
*/

exports.search = async (keywords, page) => {

	try {

		let params = { "sort": "year", "order": -1, "keywords": keywords };
		let response = await axios.get(`${BASE_URL}/movies/${page}?${qs.stringify(params)}`);

		if (!response.data.length)
			return [];

		return response.data.map((movie) => {
			return {
				"imdb_id": movie.imdb_id,
				"title": movie.title,
				"year": movie.year,
				"synopsis": movie.synopsis,
				"runtime": movie.runtime,
				"genres": movie.genres.join(";").toLowerCase(),
				"image": movie.images.banner,
				"rating": movie.rating.percentage / 10,
				"api": "popcorntime"
			};
		});

	} catch (error) {

		log(5, "hypertube-server", "popcorntime-api.js", error.message);
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

		let response = await axios.get(`${BASE_URL}/movie/${encodeURIComponent(imdb_id)}`);

		if (!response.data)
			return {};

		let movie = response.data;
		let torrents = [];
		for (let lang in movie.torrents) {
			for (let qual in movie.torrents[lang]) {
				torrents.push({
					"language": ISO6391.getName(lang).toLowerCase(),
					"resolution": qual,
					"size": movie.torrents[lang][qual].size,
					"magnet": movie.torrents[lang][qual].url
				});
			}
		}

		return {
			"imdb_id": movie.imdb_id,
			"title": movie.title,
			"year": movie.year,
			"synopsis": movie.synopsis,
			"runtime": movie.runtime,
			"genres": movie.genres.join(";").toLowerCase(),
			"image": movie.images.banner,
			"rating": movie.rating.percentage / 10,
			"trailer": movie.trailer,
			"torrents": torrents,
			"api": "popcorntime"
		};

	} catch (error) {

		log(5, "hypertube-server", "popcorntime-api.js", error.message);
		return null;

	}

};

/*
**	@params		N/A
**	@ret		{object}	-- object that contain movie's data & informations (could be empty if not found)
**	@onerror	{null}		-- + error is logged to stderr
*/

exports.random = async () => {

	try {

		let response = await axios.get(`${BASE_URL}/random/movie`);

		if (!response.data)
			return {};

		let movie = response.data;
		let torrents = [];
		for (let lang in movie.torrents) {
			for (let qual in movie.torrents[lang]) {
				torrents.push({
					"language": ISO6391.getName(lang).toLowerCase(),
					"resolution": qual,
					"magnet": movie.torrents[lang][qual].url
				});
			}
		}

		return {
			"imdb_id": movie.imdb_id,
			"title": movie.title,
			"year": movie.year,
			"synopsis": movie.synopsis,
			"runtime": movie.runtime,
			"genres": movie.genres.join(";").toLowerCase(),
			"image": movie.images.banner,
			"rating": movie.rating.percentage / 10,
			"trailer": movie.trailer,
			"torrents": torrents,
			"api": "popcorntime"
		};

	} catch (error) {

		log(5, "hypertube-server", "popcorntime-api.js", error.message);
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

		let params = { "sort": "trending", "order": -1, "genre": genre };
		let response = await axios.get(`${BASE_URL}/movies/1?${qs.stringify(params)}`);

		if (!response.data.length) {
			params = { "sort": "trending", "order": -1 };
			response = await axios.get(`${BASE_URL}/movies/1?${qs.stringify(params)}`);
		}

		return response.data.slice(0, 10).map((movie) => {
			return {
				"imdb_id": movie.imdb_id,
				"title": movie.title,
				"year": movie.year,
				"synopsis": movie.synopsis,
				"runtime": movie.runtime,
				"genres": movie.genres.join(";").toLowerCase(),
				"image": movie.images.banner,
				"rating": movie.rating.percentage / 10
			};
		});

	} catch (error) {

		log(5, "hypertube-server", "yts-api.js", error.message);
		return null;

	}

};
