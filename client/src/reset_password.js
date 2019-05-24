import React, { Component } from "react";
import { withRouter } from "react-router";
import { Container, Row } from "react-bootstrap";
import { call, message } from "./api";
import qs from "query-string";

import "./css/sign.css";

class PasswordReset extends Component {
	constructor(props){
		super(props);

		this.state = {"new_password": null, "confirm_password": null, "token": null};

		this.updateValue = this.updateValue.bind(this);
		this.submitForm = this.submitForm.bind(this);
	}
	
	updateValue(e) {
		e.preventDefault();
		this.setState({[e.target.id]: e.target.value});
	}

	async submitForm(e){
		e.preventDefault();
		let response = await call("/account/reset_password", this.state);
		if (response.status === 200){
			this.props.history.push("/sign/in");
			message("success", "password successfuly updated");
		}
		else
			message("error", response.message);
	}

	componentDidMount() {
		this.setState({ "token": qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).token });
	}

	render() {
		return (
			<Container>
				<Row>
					<div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
						<div className="card card-signin my-5" style={{ backgroundColor: "#100e10" }}>
							<div className="card-body">
								<form className="form-signin" onSubmit={this.submitForm}>
									<div className="form-label-group">
										<input type="password" id="new_password" className="form-control" placeholder="new password" autoFocus onChange={this.updateValue}/>
										<label htmlFor="new_password">new password</label>
									</div>
									<div className="form-label-group">
										<input type="password" id="confirm_password" className="form-control" placeholder="confirm password" autoFocus onChange={this.updateValue}/>
										<label htmlFor="confirm_password">confirm password</label>
									</div>
									<button
										className="btn btn-lg btn-danger btn-block text-uppercase"
										type="submit"
									>
										Update Password
									</button>
								</form>
							</div>
						</div>
					</div>
				</Row>
			</Container>
		);
	}
}

export default withRouter(PasswordReset);
