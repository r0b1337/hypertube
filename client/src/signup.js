import React, { Component } from "react";
import { withRouter } from "react-router";
import { Container, Row } from "react-bootstrap";
import { call, message } from "./api"
import Message from "./message";

import "./css/sign.css";

class SignUp extends Component {
	constructor(props){
		super(props);

		this.state = {
			"username": null,
			"email": null,
			"password": null,
			"lastname": null,
			"firstname": null,
			"image": null,
			"button_text": Message("profile.img.upload")
		};

		this.updateValue = this.updateValue.bind(this);
		this.submitForm = this.submitForm.bind(this);
		this.uploadImage = this.uploadImage.bind(this);
	}
	
	updateValue(e) {
		e.preventDefault();
		this.setState({[e.target.id]: e.target.value});
	}

	uploadImage(e) {
		let fileReader = new FileReader();
		fileReader.onload = () => {
			this.setState({ "image" : fileReader.result });
		}
		if (e.target.files.length > 0) {
			fileReader.readAsDataURL(e.target.files[0]);
			this.setState({ "button_text": e.target.files[0].name });
		}
	}

	async submitForm(e){
		e.preventDefault();
		let response = await call("/sign/up", this.state);
		if (response.status !== 200) {
			message("error", response.message);
		} else {
			this.props.history.push("/sign/in");
			message("success", Message("mess.signup"));
		}
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
										<label htmlFor="username">{ Message("signup.sign.username") }</label>
									</div>
									<div className="form-label-group">
										<input type="password" id="password" className="form-control" placeholder="password" onChange={this.updateValue}/>
										<label htmlFor="password">{ Message("signup.sign.password") }</label>
									</div>
									<div className="form-label-group">
										<input type="email" id="email" className="form-control" placeholder="email" onChange={this.updateValue}/>
										<label htmlFor="email">e-mail</label>
									</div>
									<div className="form-label-group">
										<input type="text" id="firstname" className="form-control" placeholder="firstname" onChange={this.updateValue}/>
										<label htmlFor="firstname">{ Message("signup.sign.fn") }</label>
									</div>
									<div className="form-label-group">
										<input type="text" id="lastname" className="form-control" placeholder="lastname" onChange={this.updateValue}/>
										<label htmlFor="lastname">{ Message("signup.sign.ln") }</label>
									</div>
									<div className="form-label-group-image">
										<input type="file" style={{display: "none"}} id="image" onChange={this.uploadImage}/>
										<input type="text" className="form-control" placeholder="image" disabled/>
										<label htmlFor="image" style={{color:"#545454"}} >{this.state.button_text}</label>
									</div>
									<button
										className="btn btn-lg btn-danger btn-block text-uppercase"
										type="submit"
									>
										{ Message("header.connect.btn2") }
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

export default withRouter(SignUp);
