import { Component } from "react";
import { withRouter } from "react-router";
import qs from "query-string";
import { message } from "./api";

import "./css/sign.css";

class Redirect extends Component {
	constructor(props){
		super(props);
		this.state = { "status": null, "message": null };
		this.doRedirect = this.doRedirect.bind(this);
	}

	componentWillMount() {
		this.setState({ "status": qs.parse(this.props.location.search, { "ignoreQueryPrefix": true }).status });
		this.setState({ "message": qs.parse(this.props.location.search, { "ignoreQueryPrefix": true }).message });
	}

	doRedirect() {
		this.props.history.push("/");
		message(this.state.status === "200" ? "success" : "error", this.state.message);
	}

	render() {
		this.doRedirect();
		return null;
	}
}

export default withRouter(Redirect);
