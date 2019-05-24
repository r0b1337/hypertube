// react
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Favicon from 'react-favicon';

// hypertube app component
import Header from './header';
import Home from './home';
import Search from './search';
import SignUp from './signup';
import SignIn from './signin';
import Profile from './profile';
import ConfirmAccount from './confirm_account';
import SendResetPassword from './send_reset_password';
import ResetPassword from './reset_password';
import Movie from './movie';
import Redirect from "./redirect";
import { call } from './api';
import NotFound from "./404";

// css style
import './css/bootstrap.min.css';
import './css/index.css';

// react-toastify stuff to render styled notifications/pop-ups
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

// medias
import favicon from './medias/favicon.png';

// service worker
import * as serviceWorker from './serviceWorker';

// react-router used for routing
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			user_id:
			localStorage.getItem('user_id') === 'null'
			? null
			: localStorage.getItem('user_id'),
			language:
			localStorage.getItem('language') === 'null'
			? "en"
			: localStorage.getItem('language')
		};

		this.getUserId = this.getUserId.bind(this);
		this.setUserId = this.setUserId.bind(this);
		this.setLg = this.setLg.bind(this);
		this.confirmSession = this.confirmSession.bind(this);
	}

	getUserId() {
		return this.state.user_id;
	}

	setUserId(id) {
		this.setState({ user_id: id });
		localStorage.setItem('user_id', id);
		return;
	}
	
	async setLg(lang) {
		await localStorage.setItem('language', lang);
		await this.setState({ language: lang });
		return;
	}

	async confirmSession() {
		let response = await call(`/account/session`, this.state);
		if (response.status === 400) {
			localStorage.setItem('user_id', null);
			localStorage.setItem('language', 'en');
			this.setState({ user_id: null });
		} else {
			localStorage.setItem('user_id', response.data.user_id);
			localStorage.setItem('language', this.state.language);
			this.setState({ user_id: response.data.user_id });
		}
	}

	componentDidMount() {
		this.confirmSession();
	}

	render() {
		return (
			<div>
				<Favicon url={favicon} />
				<ToastContainer
					toastClassName="toast-container"
					bodyClassName="toast-body"
					closeButton={false}
					hideProgressBar={true}
					autoClose={1500}
				/>
				<Router>
					<div>
						<Header setLg={this.setLg} setUserId={this.setUserId} user_id={this.state.user_id} />
						<Switch>
							<Route
								exact
								path="/"
								component={this.state.user_id ? Search : Home}
							/>
							<Route
								path="/sign/up"
								component={() => <SignUp setUserId={this.setUserId} />}
							/>
							<Route
								path="/sign/in"
								component={() => <SignIn setLg={this.setLg} setUserId={this.setUserId} />}
							/>
							<Route
								exact path="/profile"
								component={() => <Profile user_id={this.state.user_id} />}
							/>

							<Route
								path="/profile/:user"
								component={() => <Profile user_id={this.state.user_id} />}
							/>
							<Route path="/confirm_account" component={ConfirmAccount} />
							<Route
								path="/send_reset_password"
								component={SendResetPassword}
							/>
							<Route path="/reset_password" component={ResetPassword} />
							<Route path="/movie/:imdb_id" component={Movie} />
							<Route path="/redirect" component={ Redirect } />
							<Route path="/404/" component={ NotFound }/>
							<Route component={ NotFound }/>
						</Switch>
					</div>
				</Router>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
