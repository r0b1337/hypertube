/*
**	This is Hypertube mysql's startup script,
**	it should be executed only on mysql-db's build phase or to clean up current data
*/

/* -- creating database -- */
DROP DATABASE IF EXISTS hypertube_db;
CREATE DATABASE IF NOT EXISTS hypertube_db DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;
SET @@SESSION.time_zone = '+01:00';
SET @@GLOBAL.time_zone = '+01:00';

/* -- adding users table -- */
CREATE TABLE IF NOT EXISTS hypertube_db.users (
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	id_oauth_42 INT,
	id_oauth_google TEXT,
	id_oauth_github TEXT,
	status BOOLEAN NOT NULL DEFAULT FALSE,
	admin BOOLEAN NOT NULL DEFAULT FALSE,
	email TEXT NOT NULL,
	username TEXT NOT NULL,
	password TEXT,
	firstname TEXT NOT NULL,
	lastname TEXT NOT NULL,
	language TEXT NOT NULL,
	image TEXT NOT NULL
);

/* -- adding movies table -- */
CREATE TABLE IF NOT EXISTS hypertube_db.movies (
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	imdb_id TEXT NOT NULL,
	`path` TEXT NOT NULL,
	title TEXT NOT NULL,
	year TEXT,
	synopsis TEXT NOT NULL,
	runtime INT NOT NULL,
	genres TEXT NOT NULL,
	image TEXT NOT NULL,
	rating INT,
	trailer TEXT,
	`size` TEXT NOT NULL,
	expiration_date TIMESTAMP DEFAULT (DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 MONTH)),
	download_status BOOLEAN NOT NULL DEFAULT FALSE
);

/* -- adding comments table -- */
CREATE TABLE IF NOT EXISTS hypertube_db.comments (
	user_id	INT NOT NULL,
	imdb_id TEXT NOT NULL,
	`username` TEXT NOT NULL,
	`comment` TEXT NOT NULL,
	rating INT NOT NULL,
	`date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* -- adding tokens table -- */
CREATE TABLE IF NOT EXISTS hypertube_db.tokens (
	user_id	INT NOT NULL,
	token TEXT NOT NULL,
	expiration_date TIMESTAMP DEFAULT (DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 DAY)),
	`type` TEXT NOT NULL
);

/* -- adding viewed table -- */
CREATE TABLE IF NOT EXISTS hypertube_db.viewed (
	user_id	INT NOT NULL,
	imdb_id TEXT NOT NULL,
	title TEXT NOT NULL,
	`date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
