const log = require("./log");
const fs = require("fs");
const axios = require("axios");
const AdmZip = require("adm-zip");

const convert = async (srt) => {
	let webvtt = srt2webvtt(srt);
	return webvtt;
}

exports.download = async (url, imdbid, languageid, callback) => {
	try {
		let zip = fs.createWriteStream("./tmp.zip");
		let response = await axios(url, {"responseType": "stream"});
		response.data.pipe(zip).on("finish", () => {
			let zip = new AdmZip("./tmp.zip")
			var zipEntries = zip.getEntries(); // an array of ZipEntry records
			zipEntries.forEach(async (zipEntry) => {
        		if (zipEntry.entryName.endsWith(".srt")) {
					let srt = await zipEntry.getData().toString("utf8");
					let vtt = await convert(srt);
					if (!fs.existsSync("./subtitles"))
						fs.mkdirSync("./subtitles");
					fs.writeFileSync(`./subtitles/${imdbid}-${languageid}.vtt`, vtt);
					if (fs.existsSync("./tmp.zip"))
						fs.unlinkSync("./tmp.zip");
					if (fs.existsSync("./tmp.srt"))
						fs.unlinkSync("./tmp.srt");
					return callback();
        		}
			});
		});
		
	} catch (error) {
		console.log(error);
	}
}

exports.select = (subtitles, languageid) => {
	let url;
	if (subtitles) {
		if (languageid === "eng") {
			subtitles.data.map((subtitle) => {
				if (subtitle.MovieReleaseName.match("720")) {
					url = subtitle.ZipDownloadLink;
				}
			});
			subtitles.data.map((subtitle) => {
				if (subtitle.InfoReleaseGroup.match("YTS") && subtitle.MovieReleaseName.match("720")) {
					url = subtitle.ZipDownloadLink;
				}
			});
		}
		else if (languageid === "fre") {
			subtitles.data.map((subtitle) => {
				if (subtitle.MovieReleaseName.match("720p")) {
					url = subtitle.ZipDownloadLink;
				}
			});
		}
	}
	return url;
}

function srt2webvtt(data) {
	// remove dos newlines
	let srt = data.replace(/\r+/g, '');
	// trim white space start and end
	srt = srt.replace(/^\s+|\s+$/g, '');
	// get cues
	let cuelist = srt.split('\n\n');
	let result = "";
	if (cuelist.length > 0) {
		result += "WEBVTT\n\n";
		for (let i = 0; i < cuelist.length; i=i+1) {
			result += convertSrtCue(cuelist[i]);
		}
	}
	return result;
}

function convertSrtCue(caption) {
	// remove all html tags for security reasons
	//srt = srt.replace(/<[a-zA-Z\/][^>]*>/g, '');
	let cue = "";
	let s = caption.split(/\n/);
	// concatenate muilt-line string separated in array into one
	while (s.length > 3) {
		for (let i = 3; i < s.length; i++) {
			s[2] += "\n" + s[i]
		}
		s.splice(3, s.length - 3);
	}
	let line = 0;
	// detect identifier
	if (!s[0].match(/\d+:\d+:\d+/) && s[1].match(/\d+:\d+:\d+/)) {
		cue += s[0].match(/\w+/) + "\n";
		line += 1;
	}
	// get time strings
	if (s[line].match(/\d+:\d+:\d+/)) {
	// convert time string
		let m = s[1].match(/(\d+):(\d+):(\d+)(?:,(\d+))?\s*--?>\s*(\d+):(\d+):(\d+)(?:,(\d+))?/);
		if (m) {
			cue += m[1]+":"+m[2]+":"+m[3]+"."+m[4]+" --> "
				+m[5]+":"+m[6]+":"+m[7]+"."+m[8]+"\n";
			line += 1;
		} else {
		// Unrecognized timestring
			return "";
		}
	} else {
	// file format error or comment lines
		return "";
	}
	// get cue text
	if (s[line]) {
		cue += s[line] + "\n\n";
	}
	return cue;
}
