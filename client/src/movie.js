import React, { Component } from "react";
import { withRouter } from "react-router";
import {Tabs, Tab, Card, ListGroup, ListGroupItem, Col} from 'react-bootstrap';
import Player from "./player";
import { call, message } from "./api";
import Message from "./message";

import "./css/video.css";
import "./css/video2.css";
import "./css/style.css";
import ImgRating from "./medias/rating.png"

class Poster extends Component {
	render () {
		if (this.props.movie)
			return (
				<center><Card style={{ "marginRight": "2rem", "marginLeft": "2rem", "marginTop": "2rem", "marginBottom": "2rem", "maxWidth": "40rem", "minWidth": "15rem"}}>
						<Card.Img variant="top" alt="" src={this.props.movie.image}/>
						<Card.Body>
							<Card.Title>{this.props.movie.title}<small className="text-muted mx-3">{this.props.movie.year}</small></Card.Title>
							<Card.Text>
								{this.props.movie.synopsis}
							</Card.Text>
						</Card.Body>
						<ListGroup className="list-group-flush">
							<ListGroupItem><span style={{textDecoration: 'underline', fontSize: '16px'}}>{ Message("movie.poster.genre") }:</span> {this.props.movie.genres.split(";").join(", ")}</ListGroupItem>
						</ListGroup>
						<Card.Body>
							<Card.Link href={`https://www.imdb.com/title/${this.props.movie.imdb_id}`}>{ Message("movie.poster.info") }?</Card.Link>
						</Card.Body>
				</Card></center>
			);
		else
			return null;
	}
}

class Comments extends Component {
	render () {
		return (
			<div>
				<div className="all_comms">
					<div className="comms">
						<blockquote className="blockquote">
							<p className="mb-0">{ this.props.data.comment }</p>
							<footer className="blockquote-footer">{ Message("movie.comments.from") } <cite title="Source Title"><a style={{color: '#fff'}} href={"/profile/" + this.props.data.user_id}>{ this.props.data.username }</a></cite> { Message("movie.comments.at") } <cite title="Source Title">{ this.props.data.date }</cite></footer>
						</blockquote>
					</div>
					<div className="rating">
						<h5>{ this.props.data.rating }/10<img width="35px" alt="" src={ImgRating}/></h5>
					</div>
				</div>
				<hr className="my-4" style={{ backgroundColor: "#393e46", color: "#393e46", height: "1px", border: "none" }} />
			</div>
		);
	}
}

class Comment extends Component {
	constructor(props) {
		super(props);

		this.state = {"rating": "", "comment": "", "imdb_id": this.props.movie.imdb_id};
		this.newComment = this.newComment.bind(this);
		this.updateValue = this.updateValue.bind(this);
	}

	async newComment(e) {
		e.preventDefault(e);
		let response = await call("/movies/comment", this.state);
		if (response.status === 200)
		{
			this.props.getMovie();
			message("success", response.message);
			document.getElementById("comment").value = "";
			document.getElementById("rating").value = "1";
		}	
		else
			message("error", response.message);

	}


	updateValue(e) {
		e.preventDefault();
		this.setState({[e.target.id]: e.target.value});
	}

	componentDidMount() {
		this.setState({"rating": "1"});
	}

	render () {
		return (
			<div className="form_comments">
				<div className="comms_box" id="style-2">
					{
						this.props.movie.comments && this.props.movie.comments.length ? this.props.movie.comments.map((comments, index) => (<Comments data={comments} key={index} />)) : <h2>{ Message("movie.comment.nda") }</h2>
					}			
				</div>
				<div style={{marginTop: '40px'}}>
					<form onSubmit={ this.newComment } >
						<fieldset>
							<div className="form-group">
								<label htmlFor="Rating">{ Message("movie.comment.rating") }</label>
								<select className="form-control" id="rating" onChange={this.updateValue}>
									<option>1</option>
									<option>2</option>
									<option>3</option>
									<option>4</option>
									<option>5</option>
									<option>6</option>
									<option>7</option>
									<option>8</option>
									<option>9</option>
									<option>10</option>
								</select>
							</div>
							<div className="form-group">
								<label htmlFor="comment">{ Message("movie.comment.new") }</label>
								<textarea className="form-control" placeholder={ Message("movie.comment.phm") } id="comment" rows="3" onChange={this.updateValue}></textarea>
							</div>
							<button type="submit" className="btn btn-danger">{ Message("movie.comment.btn") }</button>
						</fieldset>
					</form>
				</div>
			</div>
		);
	}
}

class Result extends Component {
	render() {
		return (
			<Col style={{ "marginTop": "2rem", "marginBottom": "2rem", "maxWidth": "30rem", "minWidth": "22rem"}}>
				<Card>
					<Card.Img variant="top" alt="" src={this.props.result.image} />
					<Card.Body>
						<Card.Title className="clickable"><a href={"/movie/" + this.props.result.imdb_id} style={{color: '#fff'}} >{this.props.result.title}</a><small className="text-muted mx-3">{this.props.result.year}</small></Card.Title>
						<Card.Text>
							{this.props.result.synopsis.slice(0, 200)}...
						</Card.Text>
					</Card.Body>
					<Card.Footer>
						<small className="text-muted">{ Message("search.result.rated") } {this.props.result.rating}/10<img width="25px" alt="" src="/static/media/rating.cd2a10ea.png"/></small>
					</Card.Footer>
				</Card>
			</Col>

		);
	}
}

class Results extends Component {
	constructor(props){
		super(props);

		this.state = { "data": "", "genres" : this.props.results.genres, "api": this.props.results.api };

		this.getMovie = this.getMovie.bind(this);

	}

	async getMovie(){
		let response = await call("/movies/suggestions_by_genre", this.state);
		if (response.status === 200)
			this.setState({"data": response.data});
		else
			this.props.history.push("/");
	}

	async componentDidMount(){
		await this.getMovie();
	}

	render(){
		if (this.props.results){
			return (
				<div className="m-4 flex-div flex-wrap">
					{ 	this.state.data && this.state.data.length ? this.state.data.map((data, index) => (<Result result={data} key={index} history={this.props.history} />)) : <h2>{ Message("movie.comment.nda") }</h2> }
				</div>
			);}
		else
			return null;
	}
}


class Movie extends Component {
	constructor(props){
		super(props);

		this.state = { "movie" : null};


		this.getMovie = this.getMovie.bind(this);
		this.getView = this.getView.bind(this);
	}

	async getMovie(){
		let response = await call("/movies/details", {"imdb_id": this.props.match.params.imdb_id});
		if (response.status === 200)
			this.setState({"movie": response.data});
		else {
			message("error", response.message);
			this.props.history.push("/404");
		}
	}

	async getView() {
		if (this.state.movie !== null)
		{	
			await call("/movies/view", {"imdb_id": this.state.movie.imdb_id, "title": this.state.movie.title});
			await call("/movies/update", {"imdb_id": this.state.movie.imdb_id});
		}
	}

	async componentDidMount(){
		await this.getMovie();
		await this.getView();
	}

	render() {
		if (this.state.movie)
			return (
				<div className="all_video">
					<Player imdb_id={this.state.movie.imdb_id}/>
					<div className="tabs_infos">
						<Tabs defaultActiveKey="Informations" id="uncontrolled-tab-example">
							<Tab  eventKey="Informations" title={ Message("movie.movie.info") }>
								<Poster movie={this.state.movie}/>
							</Tab>
							<Tab eventKey="Comments" title={ Message("movie.movie.coms") }>
								<Comment movie={this.state.movie} getMovie={this.getMovie} />
							</Tab>
							<Tab eventKey="Suggestions" title={ Message("movie.movie.sugg") }>
								<Results results={this.state.movie} history={this.props.history} />
							</Tab>
						</Tabs>
					</div>
				</div>
			);
		else
			return null;
	}
}

export default withRouter(Movie);
