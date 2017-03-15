import React, { PureComponent } from 'react';
import { initializeApp, auth } from 'firebase';
const provider = new auth.GoogleAuthProvider();

try {
  initializeApp({
    apiKey: 'AIzaSyCZ_hHXnJ-biguRwfOlv2kVY0yZycCOZAQ',
    authDomain: 'log-me-in-b7816.firebaseapp.com',
    databaseURL: 'https://log-me-in-b7816.firebaseio.com',
    storageBucket: 'log-me-in-b7816.appspot.com',
    messagingSenderId: '858560226265'
  });
} catch(err) {
  // taken from https://github.com/now-examples/next-news/blob/master/lib/db.js
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack)
  }
}

export default class Index extends PureComponent {
  constructor() {
    super();
    this.state = {
      user: auth().currentUser,
      value: '',
    };
    this._login = this._login.bind(this);
    this._logout = this._logout.bind(this);
    this._updateUserState = this._updateUserState.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    auth().onAuthStateChanged(this._updateUserState);
  }

  _login() {
    auth().signInWithPopup(provider);
  }

  _logout() {
    auth().signOut();
  }

  _updateUserState(user) {
    this.setState({ user });
  }

  _handleChange(e) {
    this.setState({value: e.target.value});
  }

  _handleSubmit(e) {
    event.preventDefault();
    console.log('A name was submitted: ' + this.state.value);
  }

  render() {
    const { user, value } = this.state;
    return (
      <div>
        {
          user
          ? <div onClick={this._logout}>Sign out</div>
          : <div onClick={this._login}>Log In/Sign up</div>
        }
        {
          user &&
          <div>
            <form onSubmit={this._handleSubmit}>
              <input type="text" onChange={this._handleChange} value={value} />
            </form>
            <ul></ul>
          </div>
        }
      </div>
    );
  }
}
