import React, { Component } from "react";
import { withRouter } from "react-router";
import { Navbar, Nav, Button} from "react-bootstrap";
import { call, message } from "./api";
import Message from "./message";

import "./css/header.css";

import ImgFr from "./medias/fr.png"
import ImgEn from "./medias/en.jpg"

class SignButton extends Component {
	constructor(props){
		super(props);
		
		this.signOut = this.signOut.bind(this);
		this.setLanguage = this.setLanguage.bind(this);
	}

	async signOut(){
		let response = await call("/sign/out");
		if (response.status === 200){
			this.props.setUserId(null);
			this.props.history.push("/");
			message("success", Message("mess.logout"));
		}
	}

	async setLanguage(lg) {
		let response = await call("/update/", {"language":lg});
		if (response.status === 200){
			this.props.setLg(lg);
		} else {
			message("error", Message("mess.clang"));
		}

	}

	render () {
		if (!this.props.user_id) {
			return (
				<div style={{ fontFamily: "'Heebo', sans-serif", color: "#F5F5DC" }}>
					<img className="img1" alt="fr" src={ ImgFr } height="25" width="38" onClick={ () => this.props.setLg("fr") } />
					<img className="img2" alt="en" src={ ImgEn } height="25" width="38" onClick={ () => this.props.setLg("en") } />
					<Button onClick={ () => { this.props.history.push("/sign/in") }} variant="danger" style={{ marginRight: "10px" }}>{ Message("header.connect.btn") }</Button>
					<Button onClick={ () => { this.props.history.push("/sign/up") }} variant="danger">{ Message("header.connect.btn2") }</Button>
				</div>
			);
		}
		else {
			return (
				<div style={{ fontFamily: "'Heebo', sans-serif", color: "#F5F5DC" }}>
					<img className="img1" alt="fr" src={ ImgFr } height="25" width="38" onClick={ () => this.setLanguage("fr") } />
					<img className="img2" alt="en" src={ ImgEn } height="25" width="38" onClick={ () => this.setLanguage("en") } />
					<Button onClick={this.signOut} variant="danger">{ Message("header.connect.btn3") }</Button>
				</div>
			);
		}
	}
}

class LoggedNavbar extends Component {
	render () {
		if (this.props.user_id) {
			return (
				<Nav>
					<Nav.Link onClick={() => this.props.history.push("/profile")}>{ Message("header.poss.btn") }</Nav.Link>
				</Nav>
			);
		} else {
			return null;
		}
	}
}

class Header extends Component {
	// setting the document title to our project name
	componentDidMount() {
		document.title = "HYPERTUBE";
	}

	render() {
		return (
			<div>
				<Navbar collapseOnSelect expand="sm" bg="dark" variant="dark" fixed="top">
					<Navbar.Brand href="#" onClick={ () => { this.props.history.push("/") }}>
						<b style={{ color: "#ff0000" }}>{" HYPERTUBE "}</b>
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="responsive-navbar-nav"/>
					<Navbar.Collapse id="responsive-navbar-nav">
						<LoggedNavbar user_id={this.props.user_id} history={this.props.history}/>
						<Navbar.Collapse className="justify-content-end" >
							<SignButton setLg={this.props.setLg} setUserId={this.props.setUserId} user_id={this.props.user_id} history={ this.props.history } />
						</Navbar.Collapse>
					</Navbar.Collapse>
				</Navbar>
				<Navbar bg="dark" variant="dark" style={{visibility: "hidden"}}>
					<Navbar.Brand> 
						<b>{" HYPERTUBE "}</b>
					</Navbar.Brand>
				</Navbar>
			</div>
		);
	}
}

export default withRouter(Header);
