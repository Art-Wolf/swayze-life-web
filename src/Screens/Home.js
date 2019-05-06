import React, { Component } from 'react';
import { LinkContainer } from "react-router-bootstrap";
import userApi from '../API/User';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  async componentDidMount() {
    const {getIdToken, isAuthenticated, getName, getUserId } = this.props.auth;

    if (isAuthenticated()) {
      if (this.state.isLoading) {

        let listUsers = await userApi.listUsers(getIdToken());

        this.setState({ users: listUsers })
        let body = {'name': getName(), 'auth0': getUserId()};

        let currentUser = this.userExistsCheck(body);

        if (!currentUser) {
          this.createUser(body);
        } else {
          this.setState({ current_user: currentUser});
        }

        this.setState({ isLoading: false })
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

  renderBingoGrid(bingoList, min, max) {
      return [{}].concat(bingoList).map(
        (bingo, i) =>
          i !== 0 && i >= min && i <= max
            ?
                <div className={
                        "column " +
                        (bingo.completed ? "bingoCompleted" : "")
                      } key={i}>
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
              <div className="bingoGrid">
                <div className="bingoRow">
                  {this.state.current_user ? this.renderBingoGrid(this.state.current_user.bingoList, 1, 4) : ''}
                </div>
                <div className="bingoRow">
                  {this.state.current_user ? this.renderBingoGrid(this.state.current_user.bingoList, 5, 8) : ''}
                </div>
                <div className="bingoRow">
                  {this.state.current_user ? this.renderBingoGrid(this.state.current_user.bingoList, 9, 12) : ''}
                </div>
                <div className="bingoRow">
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
