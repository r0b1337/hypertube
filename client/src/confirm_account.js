import { Component } from "react";
import { withRouter } from "react-router";
import { call, message } from "./api";
import qs from "query-string";

class ConfirmAccount extends Component {
	constructor(props) {
		super(props);
		this.state = { "token": "" };
		this.sendForm = this.sendForm.bind(this);
	}

	async sendForm() {
		let response = await call("/account/confirm", this.state);
		if (response.status === 200) {
			this.props.history.push("/sign/in");
			message("success", "account confirmed");
		} else {
			message("error", response.message);
		}
	}

	async componentDidMount() {
		await this.setState({ "token": qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).token });
		if (this.state.token && this.state.token.length > 0)
			this.sendForm();
	}

	render() {
		return null;
	}
}

export default withRouter(ConfirmAccount);
