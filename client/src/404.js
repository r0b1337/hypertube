import React, { Component } from "react";
import { ProgressBar } from "react-bootstrap";
import ReactTimeout from "react-timeout";
import "./css/style.css";

class NotFound extends Component {
	constructor(props){
		super(props);

		this.state = {"progress": 0};
	}

	async componentDidMount(){
		this.interval = this.props.setInterval(async () => {
			this.setState({"progress": this.state.progress + 2})
			if (this.state.progress === 100) {
				this.props.clearInterval(this.interval);
				this.props.history.push("/");
			}
		}, 50);
	}

	render(){
		return (
			<center className="my-5">
				<h1 className="my-5">Oops... 404 error</h1>
				<ProgressBar className="my-5 responsive-div" striped animated variant="danger" now={this.state.progress} />
				<h1 className="my-5">Redirecting...</h1>
			</center>
		);
	}
}

export default ReactTimeout(NotFound);
