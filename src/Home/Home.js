import React, { Component } from 'react';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  login() {
    this.props.auth.login();
  }

  listUsers() {
    const { getIdToken } = this.props.auth;

    fetch("https://klf0b851mc.execute-api.us-east-1.amazonaws.com/dev/bingos", {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + getIdToken()
            }),
            mode: 'cors'
        })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            console.log('List: ', json)
            this.setState({ users: json })
            this.setState({ isLoading: false })
        });
  }

  render() {
    const { isAuthenticated, getIdToken, getIdTokenDecoded } = this.props.auth;

    if (isAuthenticated()) {
      if (this.state.isLoading) {
        this.listUsers();
      }
    }

    return (
      <div className="container">
        {
          isAuthenticated() && (
            <div>
              <h4>
                You are logged in! Hello {getIdTokenDecoded()}
              </h4>
              <p>{getIdToken()}</p>
            </div>
            )
        }
        {
          !isAuthenticated() && (
              <h4>
                You are not logged in! Please{' '}
                <button
                  type="button"
                  className="link-button"
                  style={{ cursor: 'pointer' }}
                  onClick={this.login.bind(this)}>
                  Log In
                </button>
                {' '}to continue.
              </h4>
            )
        }
      </div>
    );
  }
}
