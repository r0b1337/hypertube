import React, { Component } from "react";
import { withRouter } from "react-router";
import { Container, Row } from "react-bootstrap";
import { call, message } from "./api";
import Message from "./message";

import "./css/sign.css";

class SignIn extends Component {
	constructor(props){
		super(props);

		this.state = {"username": null, "password": null, "user_id": null};

		this.updateValue = this.updateValue.bind(this);
		this.submitForm = this.submitForm.bind(this);
		this.getLanguage = this.getLanguage.bind(this);
	}

	async getLanguage (user_id) {
		let response = await call(`/profile/${user_id}`, this.state);
		if (response.status === 200) {
			await this.props.setLg(response.profile[0].language);
		}
		else if (response.status === 400)
			message("error", response.message);

	}
	
	updateValue(e) {
		e.preventDefault();
		this.setState({[e.target.id]: e.target.value});
	}

	async submitForm(e){
		e.preventDefault();
		let response = await call("/sign/local", this.state);
		if (response.status === 200) {
			await this.setState({user_id: response.id});
			await this.props.setUserId(response.id);
			await this.getLanguage(response.id);
			await this.props.history.push("/");
			message("success", Message("mess.signin"));
		}
		else if (response.status === 400)
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
										<input type="text" id="username" className="form-control" placeholder="username" autoFocus onChange={this.updateValue}/>
										<label htmlFor="username">{ Message("signin.sign.username") }</label>
									</div>
									<div className="form-label-group">
										<input type="password" id="password" className="form-control" placeholder="password" onChange={this.updateValue}/>
										<label htmlFor="password">{ Message("signin.sign.password") }</label>
									</div>
									<button
										className="btn btn-lg btn-danger btn-block text-uppercase"
										type="submit"
									>
										{ Message("header.connect.btn") }
									</button>
									<br/>
									<center>
										<span>oops! </span>
										<span
											className="clickable"
											onClick={() => this.props.history.push("/send_reset_password")}
										>
											{ Message("signin.sign.fp") }
										</span>
										<span>{ Message("signin.sign.or") }</span>
										<span
											className="clickable"
											onClick={() => this.props.history.push("/sign/up")}
										>
											{ Message("header.connect.btn2") }	
										</span>
										<span> { Message("signin.sign.first") }</span>
									</center>
									<hr className="my-4" style={{ backgroundColor: "#393e46", color: "#393e46", height: "2px", border: "none" }} />	
									<a style={{ textDecoration: "none" }} href="http://localhost:1337/sign/google">
										<button
											className="btn btn-lg btn-block text-uppercase"
											style={{ backgroundColor: "#ea4335", color: "white" }}
											type="button"
										>
											<i className="fab fa-google mr-2"></i> { Message("signin.sign.google") }
										</button>
									</a>
									<br/>
									<a style={{ textDecoration: "none" }} href="http://localhost:1337/sign/42">
										<button
											className="btn btn-lg btn-block text-uppercase"
											style={{ backgroundColor: "white", color: "black" }}
											type="button"
										>
											<img style={{ paddingRight: "7px" }} alt="" src="https://42.fr/wp-content/uploads/fbrfg/favicon-16x16.png"></img> { Message("signin.sign.42") }
										</button>
									</a>
									<br/>
									<a style={{ textDecoration: "none" }} href="http://localhost:1337/sign/github">
										<button
											className="btn btn-lg btn-block text-uppercase"
											style={{ backgroundColor: "#2b3137", color: "#fafbfc" }}
											type="button"
										>
											<i className="fab fa-github mr-2"></i> { Message("signin.sign.gh") }
										</button>
									</a>
								</form>
							</div>
						</div>
					</div>
				</Row>
			</Container>
		);
	}
}

export default withRouter(SignIn);
