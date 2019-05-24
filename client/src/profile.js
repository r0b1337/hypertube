import React, { Component } from 'react';
import Message from './message';
import { withRouter } from 'react-router';
import { Tabs, Tab, Image } from 'react-bootstrap';
import { message, call } from './api';

import './css/profile.css';
import './css/sign.css';

class Informations extends Component {
	constructor(props) {
		super(props);
		this.state = { username: '', firstname: '', lastname: '' };

		this.updateProfile = this.updateProfile.bind(this);
		this.updateValue = this.updateValue.bind(this);
	}

	async updateProfile(e) {
		e.preventDefault(e);
		let response = await call('/update/', this.state);
		if (response.status === 200) {
			this.props.getProfile();
			message('success', response.message);
			document.getElementById('firstname').value = '';
			document.getElementById('lastname').value = '';
			document.getElementById('username').value = '';
		} else message('error', response.message);
	}

	updateValue(e) {
		e.preventDefault();
		this.setState({ [e.target.id]: e.target.value });
	}

	render() {
		if (this.props.owner === true)
		{
		return (
			<div style={{ margin: '20px 0 0 0' }}>
				<div className="inf1">
					<h5>
						<small className="text-muted"> { Message("profile.informations.firstname") } :</small>{' '}
						{this.props.profile.firstname}
					</h5>
					<form className="btn-infos" onSubmit={this.updateProfile}>
						<input
							type="text"
							className="form-control-plaintext"
							id="firstname"
							placeholder={ Message("profile.informations.new_firstname") }
							onChange={this.updateValue}
						/>
						<button type="submit" className="btn btn-danger">
							{ Message("profile.settings.save") }
						</button>
					</form>
				</div>
				<div className="inf1">
					<h5>
						<small className="text-muted"> { Message("profile.informations.lastname") } :</small>{' '}
						{this.props.profile.lastname}
					</h5>
					<form className="btn-infos" onSubmit={this.updateProfile}>
						<input
							type="text"
							className="form-control-plaintext"
							id="lastname"
							placeholder={ Message("profile.informations.new_lastname") }
							onChange={this.updateValue}
						/>
						<button type="submit" className="btn btn-danger">
							{ Message("profile.settings.save") }
						</button>
					</form>
				</div>
				<div className="inf1">
					<h5>
						<small className="text-muted"> { Message("profile.informations.username") } :</small>{' '}
						{this.props.profile.username}
					</h5>
					<form className="btn-infos" onSubmit={this.updateProfile}>
						<input
							type="text"
							className="form-control-plaintext"
							id="username"
							placeholder={ Message("profile.informations.new_username") }
							onChange={this.updateValue}
						/>
						<button type="submit" className="btn btn-danger">
							{ Message("profile.settings.save") }
						</button>
					</form>
				</div>
			</div>
		);
		}
		else {
			return (
			<div style={{ margin: '20px 0 0 0' }}>
				<div className="inf1">
					<h5>
						<small className="text-muted"> { Message("profile.informations.firstname") } :</small>{' '}
						{this.props.profile.firstname}
					</h5>
				</div>
				<div className="inf1">
					<h5>
						<small className="text-muted"> { Message("profile.informations.lastname") } :</small>{' '}
						{this.props.profile.lastname}
					</h5>
				</div>
				<div className="inf1">
					<h5>
						<small className="text-muted"> { Message("profile.informations.username") } :</small>{' '}
						{this.props.profile.username}
					</h5>
				</div>
			</div>
		);
	
		}
	}
}

class Settings extends Component {
	constructor(props) {
		super(props);
		this.state = { old_password: '', new_password: '', new_email: '' };

		this.updateEmail = this.updateEmail.bind(this);
		this.updatePassword = this.updatePassword.bind(this);
		this.updateValue = this.updateValue.bind(this);
	}

	async updatePassword(e) {
		e.preventDefault(e);
		let response = await call('/update/password', this.state);
		if (response.status === 200) {
			message('success', response.message);
			document.getElementById('old_password').value = '';
			document.getElementById('new_password').value = '';
			document.getElementById('new_email').value = '';
		} else message('error', response.message);
	}

	async updateEmail(e) {
		e.preventDefault(e);
		let response = await call('/update/email', this.state);
		if (response.status === 200) {
			message('success', response.message);
			document.getElementById('old_password').value = '';
			document.getElementById('new_password').value = '';
			document.getElementById('new_email').value = '';
		} else message('error', response.message);
	}

	updateValue(e) {
		e.preventDefault();
		this.setState({ [e.target.id]: e.target.value });
	}

	render() {
		return (
			<div style={{ margin: '20px 0 0 0' }}>
				<div style={{ margin: '30px 0 0 0' }}>
					<h5> { Message("profile.settings.password") } </h5>
					<form className="btn-infos2" onSubmit={this.updatePassword}>
						<input
							type="password"
							className="form-control-plaintext"
							id="old_password"
							placeholder={ Message("profile.settings.old_password") }
							onChange={this.updateValue}
						/>
						<input
							type="password"
							className="form-control-plaintext"
							id="new_password"
							placeholder={ Message("profile.settings.new_password") }
							onChange={this.updateValue}
						/>
						<button type="submit" className="btn btn-danger"> { Message("profile.settings.save") } </button>
					</form>
				</div>
				<div style={{ margin: '30px  0 0 0' }}>
					<h5> { Message("profile.settings.email") } </h5>
					<form className="btn-infos2" onSubmit={this.updateEmail}>
						<input
							type="email"
							className="form-control-plaintext"
							id="new_email"
							placeholder={ Message("profile.settings.new_email") }
							onChange={this.updateValue}
						/>
						<button type="submit" className="btn btn-danger"> { Message("profile.settings.save") } </button>
					</form>
				</div>
			</div>
		);
	}
}

class Img extends Component {
	constructor(props) {
		super(props);
		this.state = {
			image: '',
			button_text: Message("profile.img.upload"),
		};

		this.uploadImage = this.uploadImage.bind(this);
		this.updateImage = this.updateImage.bind(this);
	}

	uploadImage(e) {
		let fileReader = new FileReader();
		fileReader.onload = () => {
			this.setState({ image: fileReader.result });
		};
		if (e.target.files.length > 0) {
			fileReader.readAsDataURL(e.target.files[0]);
			this.setState({ button_text: e.target.files[0].name });
		}
	}

	async updateImage(e) {
		e.preventDefault(e);
		let response = await call('/image/', this.state);
		if (response.status === 200) {
			message('success', response.message);
			this.setState({ button_text: Message("profile.img.upload") });
			this.props.getProfile();
		} else message('error', response.message);
	}

	render() {
		return (
			<div className="img_all">
				<form onSubmit={this.updateImage}>
					<div className="form-label-group-image">
						<input
							type="file"
							style={{ display: 'none' }}
							id="image"
							onChange={this.uploadImage}
						/>
						<input
							type="text"
							className="form-control"
							placeholder="image"
							disabled
						/>
						<label htmlFor="image" style={{ color: '#545454' }}>
							{this.state.button_text}
						</label>
					</div>
					<div className="btn-right">
						<button type="submit" className="btn btn-danger">
							{ Message("profile.settings.save") }
						</button>
					</div>
				</form>
			</div>
		);
	}
}

class History extends Component {
	render() {
		return (
			<div className="movie_history">
				{this.props.profile.viewed && this.props.profile.viewed.length ? (
					this.props.profile.viewed.map((viewed, index) => (
						<HistoryMovies data={viewed} key={index} />
					))
				) : (
					<h2> { Message("profile.history.data") } </h2>
				)}
			</div>
		);
	}
}

class HistoryMovies extends Component {
	render() {
		return (
			<div className="movie_all">
				<div className="movie_title">
					<blockquote className="blockquote">
						<p className="mb-0">
							<a
								style={{ color: '#fff' }}
								href={'/movie/' + this.props.data.imdb_id}
							>
								{this.props.data.title}
							</a>
						</p>
						<footer className="blockquote-footer" style={{ color: '#f7f7f7' }}>
							at{' '}
							<cite title="Source Title" style={{ color: '#f7f7f7' }}>
								{this.props.data.date}
							</cite>
						</footer>
					</blockquote>
				</div>
			</div>
		);
	}
}

class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = { profile: '', owner: false, loaded: false };

		this.getProfile = this.getProfile.bind(this);
	}

	async getProfile() {
		let user_id;
		if ((Number(this.props.match.params.user) === Number(this.props.user_id)) || !this.props.match.params.user)
		{
			await this.setState({ owner: true });
			user_id = this.props.user_id;
		}
		else
		{
			await this.setState({ owner: false });
			user_id = this.props.match.params.user;
		}
		let response = await call(`/profile/${user_id}`, null);
		if (response.status === 200)
			this.setState({ profile: response.profile[0] });
		else 
			this.props.history.push('/404');
		this.setState({ loaded: true });
	}

	componentDidMount() {
		if (this.props.user_id === null) {
			this.props.history.push('/404');
		} else if (this.state.loaded === false) {
			this.getProfile();
		}
	}

	render() {
		if (this.state.owner === true)
		{
			return (
				<div className="maincont">
					<div className="img">
						<Image
							className="img_ch"
							src={this.state.profile.image}
							width="200px"
							height="200px"
							roundedCircle
						/>
					</div>
					<div className="infos">
						<Tabs defaultActiveKey="Informations" id="uncontrolled-tab-example">
							<Tab eventKey="Informations" title="Informations">
								<Informations
									profile={this.state.profile}
									getProfile={this.getProfile}
									owner={this.state.owner}
								/>
							</Tab>
							<Tab eventKey="settings" title={ Message("profile.settings") }>
								<Settings />
							</Tab>
							<Tab eventKey="Image" title="Image">
								<Img getProfile={this.getProfile} />
							</Tab>
							<Tab eventKey="History" title={ Message("profile.history") }>
								<History profile={this.state.profile} />
							</Tab>
						</Tabs>
					</div>
				</div>
			);
		}
		else {
			return (
				<div className="maincont">
					<div className="img">
						<Image
							className="img_ch"
							src={this.state.profile.image}
							width="200px"
							height="200px"
							roundedCircle
						/>
					</div>
					<div className="infos">
						<Tabs defaultActiveKey="Informations" id="uncontrolled-tab-example">
							<Tab eventKey="Informations" title="Informations">
								<Informations
									profile={this.state.profile}
									getProfile={this.getProfile}
									owner={this.state.owner}
								/>
							</Tab>
							<Tab eventKey="History" title={ Message("profile.history") }>
								<History profile={this.state.profile} />
							</Tab>
						</Tabs>
					</div>
				</div>
			);

		}
	}
}

export default withRouter(Profile);
