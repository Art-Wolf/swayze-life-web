import React, { Component } from 'react';
import { LinkContainer, ListGroupItem } from "react-router-bootstrap";
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

        let body = {'name': getName(), 'auth0': getUserId()};

        this.setState({ users: listUsers});
        this.setState({ isLoading: false });

        let currentUser = this.userExistsCheck(body);

        if (!currentUser) {
          currentUser = await userApi.createUser(body, getIdToken());
        }

        this.setState({current_user: currentUser});
      }
    }
  }

  login() {
    this.props.auth.login();
  }

  userExistsCheck(val) {
    return this.state.users.find(el => el.auth0 === val.auth0);
  }

  renderUsersList(userList) {
    console.log("Entered renderUsersList");
    console.log(userList);

    return userList.map(
      user => {
        return (
          <div
              key={user.id}
            >
              {user.name}
            </div>
        );
      });
  }

  render() {
    const { isAuthenticated } = this.props.auth;

    return (
      <div className="container">
        {
          isAuthenticated() && (
            <div>
              <img className="swayzeImage" src="/images/patrick-swayze.png" alt="The Swayze Life"/>

              <div className="users">
                {this.state.isLoading ? 'Loading users...' : this.renderUsersList(this.state.users)}
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
