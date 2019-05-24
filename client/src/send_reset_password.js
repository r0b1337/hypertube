import React, { Component } from "react";
import { withRouter } from "react-router";
import { Container, Row } from "react-bootstrap";
import { call, message } from "./api";

import "./css/sign.css";

class SendPasswordReset extends Component {
	constructor(props){
		super(props);

		this.state = {"email": null};

		this.updateValue = this.updateValue.bind(this);
		this.submitForm = this.submitForm.bind(this);
	}
	
	updateValue(e) {
		e.preventDefault();
		this.setState({[e.target.id]: e.target.value});
	}

	async submitForm(e){
		e.preventDefault();
		let response = await call("/account/send_password_reset", this.state);
		if (response.status === 200)
			message("success", "reset mail sent");
		else
			message("error", response.message);
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
										<input type="email" id="email" className="form-control" placeholder="email" autoFocus onChange={this.updateValue}/>
										<label htmlFor="email">e-mail</label>
									</div>
									<button
										className="btn btn-lg btn-danger btn-block text-uppercase"
										type="submit"
									>
										Send password-reset link
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

export default withRouter(SendPasswordReset);
