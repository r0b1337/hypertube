import React, { Component } from "react";

import Config from "./config";

export default class Player extends Component {	
	render(){
		return (
			<center>
				<br/>
				<video height="auto" width="70%" crossOrigin="use-credentials" controls>
					<source src={`${Config.host}:${Config.ports.server}/movies/stream/${this.props.imdb_id}`} type="video/webm"/>
					<track label="English" kind="subtitles" srcLang="en" src={`http://localhost:1337/subtitles/search/${this.props.imdb_id}/eng`} default/>
					<track label="Français" kind="subtitles" srcLang="fr" src={`http://localhost:1337/subtitles/search/${this.props.imdb_id}/fre`} default/>
				</video>
				<br/>
			</center>
		);
	}

}
