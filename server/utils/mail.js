const mailer = require("nodemailer");
const crypto = require("crypto");
const config = require("../config");
const db = require("./db");
const log = require("./log");

const transporter = mailer.createTransport(config.mail);

/*
** -------------------------------------------------------------------------- **
**	Send an email to `email` to reset the user's password.
** -------------------------------------------------------------------------- **
*/

exports.reset_password = async (email) => {

	try {

		let token = crypto.randomBytes(16).toString("hex");
		let data = await db.select(["id"], "users", ["email"], [email]);
		await db.insert("tokens", ["user_id", "token", "type"], [data[0].id, token, "password"]);

		let url = `${config.host}/reset_password?token=${token}`;
		await transporter.sendMail({
			"from": '"HYPERTUBE" <hy@pertu.be>',
			"to": email,
			"subject": "HYPERTUBE - Password reset",
			"html": `<a href="${url}">Please, click here to reset your password.</a>`
		}); 

		log(3, "hypertube-server", "mail.js", `email sent to '${email}'`);

	} catch (error) {

		throw new Error(error.message);

	}
};

/*
** -------------------------------------------------------------------------- **
**	Send an email to `email` to confirm the user's account.
** -------------------------------------------------------------------------- **
*/

exports.confirm_account = async (email) => {
	
	try {

		let token = crypto.randomBytes(16).toString("hex");
		let data = await db.select(["id"], "users", ["email"], [email]);
		await db.insert("tokens", ["user_id", "token", "type"], [data[0].id, token, "email"]);
	
		let url = `${config.host}/confirm_account?token=${token}`;
		await transporter.sendMail({
			"from": '"HYPERTUBE" <hy@pertu.be>',
			"to": email,
			"subject": "HYPERTUBE - Account confirmation",
			"html": `<a href="${url}">Please, click here to activate your account.</a>`
		});
		
		log(3, "hypertube-server", "mail.js", `email sent to '${email}'`);

	} catch (error) {
	
		throw new Error(error.message);

	}

};
