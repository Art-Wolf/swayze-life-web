import React, { Component } from 'react';
import { LinkContainer } from "react-router-bootstrap";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    const { isAuthenticated } = this.props.auth;

    if (isAuthenticated()) {
      if (this.state.isLoading) {
        this.listUsers();
      }
    }
  }

  login() {
    this.props.auth.login();
  }

  userExistsCheck(val) {
    console.log("Checking for: " + val.name + ", " + val.auth0);

    return this.state.users.find(el => el.auth0 === val.auth0);
  }

  createUser(user) {
    const { getIdToken } = this.props.auth;

    fetch("https://klf0b851mc.execute-api.us-east-1.amazonaws.com/dev/users", {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + getIdToken(),
                'Content-Type': 'application/json'
            }),
            mode: 'cors',
            body: JSON.stringify(user)
        })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            console.log('Created User: ', json)
            this.setState({ current_user: json});
        });
  }

  listUsers() {
    const { getIdToken, getName, getUserId } = this.props.auth;

    fetch("https://klf0b851mc.execute-api.us-east-1.amazonaws.com/dev/users", {
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
            this.setState({ users: json })

            let body = {'name': getName(), 'auth0': getUserId()};

            if (!this.userExistsCheck(body)) {
              this.createUser(body);
            } else {
              this.setState({ current_user: this.userExistsCheck(body)});
            }

            this.setState({ isLoading: false })
        });
  }

  renderBingoGrid(bingoList, min, max) {
      return [{}].concat(bingoList).map(
        (bingo, i) =>
          i !== 0 && i >= min && i <= max
            ?
                <div className="column" key={i}>
                <LinkContainer
                    key={bingo.id}
                    to={`/bingo/${bingo.id}`}
                  >
                  <img src={bingo.icon} alt={bingo.name}/>
                </LinkContainer>
                </div>
            : ''
      );
    }

  render() {
    const { isAuthenticated, getName } = this.props.auth;

    return (
      <div className="container">
        {
          isAuthenticated() && (
            <div>
              <h4>
                You are logged in! Hello {getName()}
              </h4>
              <p>Current User set: {this.state.current_user ? 'yes' : 'no'}</p>
              <div>
                <div className="row">
                  {this.state.current_user ? this.renderBingoGrid(this.state.current_user.bingoList, 1, 4) : ''}
                </div>
                <div className="row">
                  {this.state.current_user ? this.renderBingoGrid(this.state.current_user.bingoList, 5, 8) : ''}
                </div>
                <div className="row">
                  {this.state.current_user ? this.renderBingoGrid(this.state.current_user.bingoList, 9, 12) : ''}
                </div>
                <div className="row">
                  {this.state.current_user ? this.renderBingoGrid(this.state.current_user.bingoList, 13, 16) : ''}
                </div>
              </div>
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
