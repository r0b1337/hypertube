const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const logger = require("morgan");
const config = require("./config");
const routes = require("./routes");

const passport = require("passport");
const strategy_controller = require("./controllers/strategy.controller");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FortyTwoStrategy = require("passport-42").Strategy;
const GitHubStrategy = require("passport-github").Strategy;

passport.use(new LocalStrategy(strategy_controller.local));
passport.use(new GoogleStrategy(config.oauth.google, strategy_controller.google));
passport.use(new FortyTwoStrategy(config.oauth.fortytwo, strategy_controller.fortytwo));
passport.use(new GitHubStrategy(config.oauth.github, strategy_controller.github));

passport.serializeUser((user, callback) => callback(null, user));
passport.deserializeUser((obj, callback) => callback(null, obj));

const app = express();

app.use(logger("dev"));
app.use(bodyParser.json({ "limit": "50mb", "extended": true }));
app.use(bodyParser.urlencoded({ "limit": "50mb", "extended": true }));
app.use(session({ "secret": config.session_secret, "resave": false, "saveUninitialized": false }));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
	res.header("Access-Control-Allow-Origin", config.host);
	res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
	res.header("Access-Control-Allow-Credentials", true);
	next();
})
app.use(routes);
app.use((req, res) => {
	res.status(404).json({ "status": 404, "message": "not found" });
});

config.path = __dirname;
app.listen(config.ports.server, () => console.info(`http server started at ${config.host}:${config.ports.server}`));
