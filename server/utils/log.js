const fs = require("fs");
const moment = require("moment");
const config = require("../config");

/*
**	-------------------------------------------------------------------------- +
**
**	Logging levels:
**	TRACE	[1] would be for extremely detailed and potentially high volume logs
**	DEBUG	[2] helpful messages in tracking the flow through the system/isolating issues
**	INFO	[3] things we want to see at high volume
**	WARN	[4] an unexpected technical or business event happened
**	ERROR	[5] the system is in distress, the fix probably requires human intervention
**
**	In this function, logging level 0 means an unexisting level has been given.
**	More complete descriptions at https://stackoverflow.com/a/8021604.
**
**	-------------------------------------------------------------------------- +
*/

module.exports = (_level, _app, _module, _details) => {

	const logging = [
		{ "level": 0, "word": "UNKNOWN"	, "function": console.log	},
		{ "level": 1, "word": "TRACE"	, "function": console.log	},
		{ "level": 2, "word": "DEBUG"	, "function": console.debug	},
		{ "level": 3, "word": "INFO"	, "function": console.info	},
		{ "level": 4, "word": "WARN"	, "function": console.warn	},
		{ "level": 5, "word": "ERROR"	, "function": console.error	}
	];

	let lvl = (_level >= 1 && _level <= 5) ? _level : 0;

	if (typeof _module !== "string") _module = "_unknown_";
	if (typeof _details !== "string") _details = "_no_details_";

	let msg = `${moment().format("ddd MMM DD YYYY LTS")} | ${logging[lvl].word} | ${_module} | ${_details}`;
	logging[lvl].function(msg);

};
