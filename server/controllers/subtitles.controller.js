const log = require("../utils/log");
const axios = require("axios");
const http = require("http");
const fs = require("fs");
const db = require("../utils/db")
const sbt = require("../utils/subtitles");

const OS = require('opensubtitles-api');
const OpenSubtitles = new OS("TemporaryUserAgent");

exports.search = async (req, res) => {

	let imdbid = req.params.imdbid;
	let languageid = req.params.languageid;

	if (!imdbid || !languageid) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}

	try {

		if (fs.existsSync(`./subtitles/${imdbid}-${languageid}.vtt`))
			return await res.download(`./subtitles/${imdbid}-${languageid}.vtt`);
		else {
			OpenSubtitles.api.LogIn("", "", "en", "TemporaryUserAgent").then((ret) => {
				OpenSubtitles.api.SearchSubtitles(ret.token, [
					{"imdbid": imdbid.slice(2), "sublanguageid": languageid},
				], {"limit": 100}).then(async subtitles => {
					let url = await sbt.select(subtitles, languageid);
					if (url){
						log(3, "hypertube-server", "subtitles.controller.js", `sent new subtitles for imdbid "${imdbid}" and language "${languageid}"`);
						sbt.download(url, imdbid, languageid, async (err) => {
							if (err) {
								log(4, "hypertube-server", "subtitles.controller.js", err.message);
								res.status(400).json({ "status": 400, "message": "no subtitles found" });
							}
							else
								await res.download(`./subtitles/${imdbid}-${languageid}.vtt`)
						});
					}
					else
						res.status(400).json({ "status": 400, "message": "no subtitles found" });
				});
			});
		}

	} catch (error) {

		log(5, "hypertube-server", "subtitles.controller.js", error.message);
		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};
