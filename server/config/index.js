module.exports = {
	"ports": {
		"server": 1337,
		"client": 80
	},
	"host": "http://localhost",
	"mail": {
		"service": "gmail",
		"host": "smtp.gmail.com",
		"auth": {
			"user": "master.camagru@gmail.com",
			"pass": "hacked1337"
		}
	},
	"path": "",
	"default_picture": "default-profile-picture.png",
	"session_secret": "9PgmBxjYTKGAzWxfkXspQ4tzPvPJPsM7",
	"oauth": {
		"fortytwo": {
			"clientID": "850195f6604ba45fb767853fe5cb406c0976664ba5528e644b380924631c391f",
			"clientSecret": "137eb9cebcbed9b172fc41d18cab415f4534070284a7bf47e416c85372ca9778",
			"callbackURL": "http://localhost:1337/sign/42/callback"
		},
		"google": {
			"clientID": "9251900471-0tkarho9lu6tg6i7tr8r7596eg33cc5j.apps.googleusercontent.com",
			"clientSecret": "vijGsnH24uk_3vzxHImFj9ih",
			"callbackURL": "http://localhost:1337/sign/google/callback"
		},
		"github": {
			"clientID": "9196addd9a8cedf8e1af",
			"clientSecret": "c0a71004d72deec71db888b31d1d3d70f6ac8107",
			"callbackURL": "http://localhost:1337/sign/github/callback"
		}
	},
	"allowed_movie_extensions": [".mp4", ".webm", ".mkv"]
};
