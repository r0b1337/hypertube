import React, { Component } from "react";
import { Card } from "react-bootstrap";
import Message from "./message";

import ImgRating from "./medias/rating.png"

import "./css/home.css"
import "./css/home2.css"

export default class Home extends Component {
	render() {
		return (
			<div>
				<div className="masthead">
					<div className="container h-100">
						<div className="row h-100 align-items-center">
							<div className="col-12 text-center">
								<h1 className="name">HYPERTUBE</h1>
							</div>
						</div>
					</div>
				</div>
				<div className="cont2">
					<div style={{padding:'0 0 120px 0'}}>
						<h1 className="title2" style={{textAlign:'center'}}>{ Message("home.cont2.title") }</h1>
						<h3 className="title3" style={{textAlign:'center'}}><small className="text-muted">{ Message("home.cont2.title2") }</small></h3>
					</div>
					<div className="cont3">
						<Card style={{margin:'0 100px 20px 100px'}}>
							<Card.Header style={{fontSize:'18px', color:'#fff'}}>9/10 <img width="35px" alt="" src={ ImgRating }/></Card.Header>
							<Card.Body>
								<blockquote className="blockquote mb-0">
									<p>
										{' '}
										{ Message("home.cont3.message") } {' '}
									</p>
									<footer className="blockquote-footer">
										{ Message("home.cont3.from") } <cite title="Source Title">lebgdu70</cite>
									</footer>
								</blockquote>
							</Card.Body>
						</Card>
						<Card style={{margin:'0 100px 20px 100px'}}>
							<Card.Header style={{fontSize:'18px', color:'#fff'}}>9/10 <img width="35px" alt="" src={ ImgRating }/></Card.Header>
							<Card.Body>
								<blockquote className="blockquote mb-0">
									<p>
										{' '}
										{ Message("home.cont3.message2") }{' '}
									</p>
									<footer className="blockquote-footer">
										{ Message("home.cont3.from") } <cite title="Source Title">Lautrebgdu70</cite>
									</footer>
								</blockquote>
							</Card.Body>
						</Card>
					</div>
				</div>
			</div>
		);
	}
}
