import Config from "./config"
import { toast } from 'react-toastify';
import "./css/style.css";

const axios = require("axios");

export const call = async (route, body) => {
	let params = {
		"method": "post",
		"headers": {"Content-Type": "application/json"},
		"withCredentials": true
		}

	try {

		let response = await axios.post(`${Config.host}:${Config.ports.server}${route}`, body, params);
		if (response && response.data)
			return response.data;
		else return { "status": 500, "message": "internal server error" };

	} catch (error) {
		if (error.response && error.response.data)
			return error.response.data;
		else return { "status": 500, "message": "internal server error" };
		
	}
}

export const message = (variant, message) => {
	if (variant && message) {
		message = message.charAt(0).toUpperCase() + message.substr(1);
		message = message + ".";
		if (variant === "success")
			toast(message, { className: "toast-success", bodyClassName: "toast-text"});
		if (variant === "error")
			toast(message, { className: "toast-error", bodyClassName: "toast-text"});
	}
}
