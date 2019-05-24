const db = require("./db");

/*
** -------------------------------------------------------------------------- **
**	Check if a `username` is already in use.
** -------------------------------------------------------------------------- **
*/

exports.username = async (username) => {
	try {
		let data = await db.select(["username"], "users", ["username"], [username]);
		return data;
	} catch (error) {
		throw new Error(error.message);
		return null;
	}
};

/*
** -------------------------------------------------------------------------- **
**	Check if an `email` is already in use.
** -------------------------------------------------------------------------- **
*/

exports.email = async (email) => {
	try {
		let data = await db.select(["email"], "users", ["email"], [email]);
		return data;
	} catch (error) {
		throw new Error(error.message);
		return null;
	}
};

/*
** -------------------------------------------------------------------------- **
**	Check if a `user_id` already exists.
** -------------------------------------------------------------------------- **
*/

exports.user_id = async (user_id) => {
	try {
		let data = await db.select(["id"], "users", ["id"], [user_id]);
		return data;
	} catch (error) {
		throw new Error(error.message);
		return null;
	}
};

/*
** -------------------------------------------------------------------------- **
**	Check if a `user_id` already exists.
** -------------------------------------------------------------------------- **
*/

exports.movie = async (imdb_id) => {
	try {
		let data = await db.select([], "movies", ["imdb_id"], [imdb_id]);
		return data;
	} catch (error) {
		throw new Error(error.message);
		return null;
	}
};

/*
** -------------------------------------------------------------------------- **
**	Check if a user has signed up using Oauth.
** -------------------------------------------------------------------------- **
*/

exports.oauth = async (user_id) => {
	try {
		let rets = ["id_oauth_42", "id_oauth_google", "id_oauth_github"];
		let data = await db.select(rets, "users", ["id"], [user_id]);
		return data[0].id_oauth_42 || data[0].id_oauth_google || data[0].id_oauth_github;
	} catch (error) {
		throw new Error(error.message);
		return null;
	}
};
