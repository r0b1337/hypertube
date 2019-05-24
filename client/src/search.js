import React, { Component } from "react";
// import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { Card, Col, Spinner, Button } from "react-bootstrap";
import { call, message } from "./api";
import Message from "./message";

//import ImgRating from "./medias/rating.png"

import "./css/home_nc.css";
import "./css/style.css";

/*
class ImageSugg extends Component {

	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			popoverOpen: false
		};
	}

	toggle() {
		this.setState({
			popoverOpen: !this.state.popoverOpen
		});
	}

	render() {
		return (
			<div className="cont1">
				<img width="250" height="330" src="http://citation-celebre.leparisien.fr/images/movie/240.jpg" alt=""/>
				<div className="text_cont" id="style-2">
					<h4 style={{textDecoration:'underline'}}>Joie de vivre a l'ancienne</h4>
					<h5 style={{color: '#fff'}}>Realisateur <span><h6 style={{color:'DarkGrey'}}>Bite Bite</h6></span></h5>
					<h5 style={{color: '#fff'}}>Acteur <span><h6 style={{color:'DarkGrey'}}>Bite Bite, Bite Bite et Bite Bite</h6></span></h5>
							<h5 style={{color: '#fff'}}>Annee de distribution <span><h6 style={{color:'DarkGrey'}}>en l'an 1100 bat les couilles</h6></span></h5>
					<div>
						<button id="Popover1" type="button" className="btn btn-danger">
							Résumé
						</button>
						<Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggle}>

							<PopoverHeader>Popover Title</PopoverHeader>
							<PopoverBody>Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</PopoverBody>
						</Popover>
					</div>
				</div>
			</div>

		);
	}

}
*/

/*
class Sugg extends Component {

	render() {
		return (
			<div className="movie_a_a">
				<h3>A l'affiche cette semaine</h3>
				<div className="big_cont" id="style-2">
					<ImageSugg/>
					<ImageSugg/>
					<ImageSugg/>
					<ImageSugg/>
					<ImageSugg/>
					<ImageSugg/>
					<ImageSugg/>
					<ImageSugg/>
					<ImageSugg/>
					<ImageSugg/>
					<ImageSugg/>
					<ImageSugg/>
					<ImageSugg/>
					<ImageSugg/>
					<ImageSugg/>
				</div>
			 </div>
		);
	}
}
*/

class Result extends Component {
	render() {
		return (
			<Col style={{ "marginTop": "2rem", "marginBottom": "2rem", "maxWidth": "30rem", "minWidth": "22rem"}}>
				<Card>
					<Card.Img variant="top" alt="" src={this.props.result.image} />
					<Card.Body>
						<Card.Title onClick={() => this.props.history.push(`/movie/${this.props.result.imdb_id}`)} className="clickable">{this.props.result.title}<small className="text-muted mx-3">{this.props.result.year}</small></Card.Title>
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
	render(){
		if (this.props.results){
			return (
				<div className="m-4 flex-div flex-wrap"> 
					{ this.props.results.map((result, index) => (
						<Result result={result} key={index} history={this.props.history}/>
					))}
				</div>
			);}
		else
			return null;
	}
}

class Search extends Component {
	constructor(props) {
		super(props);

		this.state = {
			"results": null,
			"suggestions": null,
			"page": 1,
			"loading": false,
			"sortby": "none",
			"order": "a-z"};

		this.search = this.search.bind(this);
		this.submit = this.submit.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.sortByYear = this.sortByYear.bind(this);
		this.sortByTitle = this.sortByTitle.bind(this);
		this.sortByRating = this.sortByRating.bind(this);
		this.sort = this.sort.bind(this);
		this.resetSort = this.resetSort.bind(this);
		this.toggleOrder = this.toggleOrder.bind(this);
		this.keywords = React.createRef();
	}

	async search(keywords) {
		this.setState({"loading": true});
		
		let response = keywords ? await call("/movies/search", { keywords, "page": this.state.page }) : await call("/movies/suggestions", {"page": this.state.page});
		this.setState({"loading": false});
		if (response.status === 200){
			if (this.state.page > 1) {
				let results = this.state.results;
				for (let i = 0; i < response.data.length; i++) {
					if (!results.some(o => o.imdb_id === response.data[i].imdb_id))
						results.push(response.data[i]);
				}
				await this.setState({ "results": results });
			}
			else {
				await this.setState({ "results": response.data });
				this.sort();
			}
		}
		else
			message("error", response.message);
	}

	async submit(e){
		e.preventDefault();
		await this.setState({"results": null, "page": 1});
		if (this.keywords.current && this.keywords.current.value !== "")
			await this.search(this.keywords.current.value);
		else
			await this.search(null);
	}

	async componentDidMount(){
		await this.search(null);
		window.addEventListener("scroll", this.handleScroll);
	}

	async handleScroll(e) {
		e.preventDefault();
		const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
		const body = document.body;
		const html = document.documentElement;
		const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
		const windowBottom = windowHeight + window.pageYOffset;
		if (windowBottom >= docHeight) {
			await this.setState({"page": this.state.page + 1});
			if (this.keywords.current){
				window.removeEventListener("scroll", this.handleScroll);
				await this.search(this.keywords.current.value);
				window.addEventListener("scroll", this.handleScroll);
			}
		}
	}

	componentWillUnmount() {
		window.removeEventListener("scroll", this.handleScroll);
	}

	async toggleOrder() {
		this.state.order === "a-z" ? await this.setState({"order": "z-a"}) : await this.setState({"order": "a-z"});
		this.sort();
	}

	sort(){
		switch (this.state.sortby){
			case "year":
				this.sortByYear();
				break;
			case "title":
				this.sortByTitle();
				break;
			case "rating":
				this.sortByRating();
				break;
			default:
				break;
		}
	}

	async sortByYear(){
		if (this.state.order === "z-a")
			await this.setState({"results": await this.state.results.sort((a, b) => b.year - a.year), "sortby": "year"});
		if (this.state.order === "a-z")
			await this.setState({"results": await this.state.results.sort((a, b) => a.year - b.year), "sortby": "year"});
	}

	async sortByTitle(){
		if (this.state.order === "z-a")
			await this.setState({"results": await this.state.results.sort((a, b) => b.title.localeCompare(a.title)), "sortby": "title"});
		if (this.state.order === "a-z")
			await this.setState({"results": await this.state.results.sort((a, b) => a.title.localeCompare(b.title)), "sortby": "title"});
	}

	async sortByRating(){
		if (this.state.order === "z-a")
			await this.setState({"results": await this.state.results.sort((a, b) => b.rating - a.rating), "sortby": "rating"});
		if (this.state.order === "a-z")
			await this.setState({"results": await this.state.results.sort((a, b) => a.rating - b.rating), "sortby": "rating"});
	}

	async resetSort(){
		await this.setState({"results": null, "sortby": "none"});
		if (this.keywords.current && this.keywords.current.value !== "")
			await this.search(this.keywords.current.value);
		else
			await this.search(null);
	}

	render() {
		return (
				<div className="search" ref={this.scroll}>
					<div>
						<form className="flex-div flex-wrap" onSubmit={this.submit}>
							<center><input className="form-control responsive-div" type="text" placeholder={ Message("search.search.phs") } ref={this.keywords}/></center>
							<span>{ Message("search.search.sb") }
								<Button variant="danger" className="mx-2" onClick={this.sortByYear}>{ Message("search.search.year") }</Button>
								<Button variant="danger" onClick={this.sortByTitle}>{ Message("search.search.title") }</Button>
								<Button variant="danger" className="mx-2" onClick={this.sortByRating}>{ Message("search.search.rating") }</Button>
								<Button variant="dark" className="mx-2" style={{backgroundColor:"black"}} onClick={this.resetSort}>x</Button>
							</span>
							<span>
								{ Message("search.search.ob") }
								<Button variant="secondary" className="mx-2" onClick={this.toggleOrder}>{this.state.order === "a-z" ? "↑" : "↓"}</Button>
							</span>
						</form>
					</div>
					<Results results={this.state.results} history={this.props.history}/>
					{ this.state.loading ? <center><Spinner className="my-5" animation="border" variant="danger" /></center> : null }
				</div>
		);
	}
} 

export default Search;
