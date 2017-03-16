import React, { PureComponent } from 'react';
import { initializeApp, auth, database } from 'firebase';

const provider = new auth.GoogleAuthProvider();

try {
  initializeApp({
    apiKey: 'AIzaSyCZ_hHXnJ-biguRwfOlv2kVY0yZycCOZAQ',
    authDomain: 'log-me-in-b7816.firebaseapp.com',
    databaseURL: 'https://log-me-in-b7816.firebaseio.com',
    storageBucket: 'log-me-in-b7816.appspot.com',
    messagingSenderId: '858560226265',
  });
} catch (err) {
  // taken from https://github.com/now-examples/next-news/blob/master/lib/db.js
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack)
  }
}

function login() {
  auth().signInWithPopup(provider);
}

function logout() {
  auth().signOut();
}

export default class Index extends PureComponent {
  constructor() {
    super();
    this.state = {
      user: auth().currentUser,
      value: '',
      messages: {},
    };
    this.updateUserState = this.updateUserState.bind(this);
    this.updateMessages = this.updateMessages.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    auth().onAuthStateChanged(this.updateUserState);
    this.messagesRef = database().ref('messages');
    this.messagesRef.on('value', snap => this.updateMessages(snap.val()));
  }

  updateUserState(user) {
    this.setState({ user });
  }

  updateMessages(messages) {
    this.setState({ messages });
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { value } = this.state;
    database().ref('messages').push({ text: value });
    this.setState({ value: '' });
  }

  render() {
    const { user, value, messages } = this.state;
    return (
      <div>
        {
          user
          ? <div onClick={logout}>Sign out</div>
          : <div onClick={login}>Log In/Sign up</div>
        }
        {
          user &&
          <div>
            <form onSubmit={this.handleSubmit}>
              <input type="text" onChange={this.handleChange} value={value} />
            </form>
            <ul>
              {
                Object.keys(messages).map(key => (
                  <li key={key}>{messages[key].text}</li>
                ))
              }
            </ul>
          </div>
        }
      </div>
    );
  }
}
