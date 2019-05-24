const mysql = require("mysql");
const util = require("util");

const log = require("./log");

/*
**	------------------------------------------------------------------------- **
**	MySQL library, promisified for async/await.
**
**	see:
**	https://medium.com/@mhagemann/create-a-mysql-database-middleware-with-node-js-8-and-async-await-6984a09d49f4
**	https://gist.github.com/hagemann/30cfee724d047007a031eb12b3a95a23
**	https://github.com/mysqljs/mysql#connection-options
**	------------------------------------------------------------------------- **
*/

const pool = mysql.createPool({
	"host"		: process.env.DB_HOST,
	"port"		: process.env.DB_PORT,
	"user"		: process.env.DB_USER,
	"password"	: process.env.DB_PASS,
	"database"	: process.env.DB_NAME,
	"charset"	: "utf8mb4",
	"timezone"	: "Europe/France"
});

pool.getConnection((error, connection) => {

	if (error) log(5, "hypertube-server", "db.js", error.message);
	if (connection) connection.release();
	return ;

});

pool.query = util.promisify(pool.query);

/*
**	------------------------------------------------------------------------- **
**	SQL SELECT command handler.
**	Used to fetch data from the MySQL database.
**
**	USAGE: db.select(null, "users", ["id"], ["1337"]);
**	USAGE: db.select(["username"], "users", ["id"], ["1337"]);
**	------------------------------------------------------------------------- **
*/

const querySelect = async (fields, table, columns, values) => {

	/* all arguments must be passed, but some can be null */
	if (typeof fields  === "undefined" || typeof table  === "undefined" ||
		typeof columns === "undefined" || typeof values === "undefined")
		return null;

	if (!fields || !fields.length)
		fields = ["*"];

	if (!table)
		return null;

	let q = `SELECT ${fields.map((e) => `\`${e}\``).join(", ")} FROM \`${table}\``;

	if (columns[0] && values[0])
		q += " WHERE ";

	for (let i = 0; i < columns.length; i++) {
		q += `\`${columns[i]}\` = ?`;
		if ((i + 1) !== columns.length)
			q += ` AND `;
	}

	try {
		let res = await pool.query(q, values);
		return res;
	} catch (error) {
		log(5, "hypertube-server", "db.js", error.message);
		return null;
	}
};

/*
**	------------------------------------------------------------------------- **
**	SQL INSERT INTO command handler.
**	Used to insert data into a MySQL table.
**
**	USAGE: db.insert("users", ["bio"], ["so cool"]);
**	------------------------------------------------------------------------- **
*/

const queryInsert = async (table, columns, values) => {

	/* all arguments must be passed */
	if (typeof table   === "undefined" || table   === null ||
		typeof columns === "undefined" || columns === null ||
		typeof values  === "undefined" || values  === null)
		return null;

	let cols = columns.map((e) => `\`${e}\``).join(", ");
	let vals = values.map((e) => mysql.escape(e)).join(", "); // escape manually
	
	try {
		let res = await pool.query(`INSERT INTO \`${table}\` (${cols}) VALUES(${vals})`);
		return res;
	} catch (error) {
		log(5, "hypertube-server", "db.js", error.message);
		return null;
	}

};

/*
**	------------------------------------------------------------------------- **
**	SQL DELETE FROM command handler.
**	Used to delete a record from any MySQL table.
**
**	USAGE: db.delete("users", ["email", "firstname"], ["a@b.c", "abc"]);
**	------------------------------------------------------------------------- **
*/

const queryDelete = async (table, columns, values) => {

	/* all arguments must be passed */
	if (typeof table   === "undefined" || table          === null ||
		typeof columns === "undefined" || columns.length === 0 ||
		typeof values  === "undefined" || values.length  === 0)
		return null;

	let q = `DELETE FROM \`${table}\` WHERE `;
	for (let i = 0; i < columns.length; i++) {
		q += `\`${columns[i]}\` = ?`;
		if ((i + 1) !== columns.length)
			q += ` AND `;
	}

	try {
		let res = await pool.query(q, values);
		return res;
	} catch (error) {
		log(5, "hypertube-server", "db.js", error.message);
		return null;
	}

};

/*
**	------------------------------------------------------------------------- **
**	SQL UPDATE command handler.
**	Used to modify any field value of any MySQL table.
**
**	USAGE: db.update("users", "email", "a@b.c", "id", "1337");
**	------------------------------------------------------------------------- **
*/

const queryUpdate = async (table, column, value, condi_col, condi_val) => {

	/* all arguments must be passed, but can be null */
	if (typeof table     === "undefined" || table     === null ||
		typeof column    === "undefined" || column    === null ||
		typeof value     === "undefined" || value     === null ||
		typeof condi_col === "undefined" || condi_col === null ||
		typeof condi_val === "undefined" || condi_val === null)
		return null;


	try {
		let res = await pool.query(`UPDATE \`${table}\` SET \`${column}\` = ? WHERE \`${condi_col}\` = ?`, [value, condi_val]);
		return res;
	} catch (error) {
		log(5, "hypertube-server", "db.js", error.message);
		return null;
	}

};

/*
**	------------------------------------------------------------------------- **
**	Library export.
**	Also exporting pool.query() to make raw queries.
**	------------------------------------------------------------------------- **
*/

module.exports = {
	"select": querySelect,
	"insert": queryInsert,
	"delete": queryDelete,
	"update": queryUpdate,
	pool
};
