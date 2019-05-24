const moment = require("moment");
const path = require("path");

const config = require("../config");

/*
** -------------------------------------------------------------------------- **
**	RegExp from: 
**	https://emailregex.com/
**	https://www.ietf.org/rfc/rfc5322.txt
** -------------------------------------------------------------------------- **
*/

exports.email = (email) => {
	let re = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
	return re.test(email);
};

/*
** -------------------------------------------------------------------------- **
**	^			# start of the line
**	[a-z0-9_-]	# allowed characters
**	{3,15}		# allowed length (at least 3 characters, max. 15)
**	$			# end of the line
** -------------------------------------------------------------------------- **
*/

exports.username = (username) => {
	let re = new RegExp(/^[a-zA-Z0-9_-]{3,15}$/);
	return re.test(username);
};

/*
** -------------------------------------------------------------------------- **
**	No validation here, because first & last names could be composed of
**	different unicodes. Must be at least 2 characters.
**
**	RegExp that might work tho: https://stackoverflow.com/a/45871742
** -------------------------------------------------------------------------- **
*/

exports.firstname = (firstname) => {
	let re = new RegExp(/^.{2,}$/);
	return re.test(firstname);
};

exports.lastname = (lastname) => {
	let re = new RegExp(/^.{2,}$/);
	return re.test(lastname);
};

/*
** -------------------------------------------------------------------------- **
**	^					# start of the line
**	(?=.*[a-z])			# must contain at least one lowercase letter
**	(?=.*[A-Z])			# must contain at least one uppercase letter
**	(?=.*\d)			# must contain at least one number
**	(?=.*[^\da-zA-Z])	# must contain at least one special character
**	.{8,}				# must be at least 8 characters long
**	$					# end of the line
**
**	RegExp from: https://stackoverflow.com/a/5859963 
** -------------------------------------------------------------------------- **
*/

exports.password = (password) => {	
	let re = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/);
	return re.test(password);
};

/*
** -------------------------------------------------------------------------- **
**	Accepting JPEG and PNG headers only.
** -------------------------------------------------------------------------- **
*/

exports.image = (image) => {
	return image.match(/^data:image\/png;base64,/) !== null ||
		   image.match(/^data:image\/jpeg;base64,/) !== null;
};

/*
** -------------------------------------------------------------------------- **
**	The only limitation here is a maximum of 280 characters.
** -------------------------------------------------------------------------- **
*/

exports.comment = (comment) => {
	return comment.length <= 280;
};

/*
** -------------------------------------------------------------------------- **
**	Rating for a movie must be an int between 1 and 10 (included).
** -------------------------------------------------------------------------- **
*/

exports.rating = (rating) => {
	return rating > 0 && rating <= 10;
};

/*
** -------------------------------------------------------------------------- **
**	Supported torrent formats are defined in 'config.allowed_movie_extensions'.
** -------------------------------------------------------------------------- **
*/

exports.extension = (filename) => {
	return config.allowed_movie_extensions.includes(path.extname(filename));
};

/*
** -------------------------------------------------------------------------- **
**	Supported language are french (fr) and english (en) (default).
** -------------------------------------------------------------------------- **
*/

exports.language = (language) => {
	return language === "fr" || language === "en";
};
