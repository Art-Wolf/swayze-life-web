import React, {Component} from 'react';
import {Container, ListGroup, ListGroupItem, Row} from 'reactstrap';
import userApi from '../API/User';

export default class Home extends Component {
  constructor (props) {
    super (props);
    this.state = {
      isLoading: true,
    };
  }

  async componentDidMount () {
    const {getIdToken, isAuthenticated, getName, getUserId} = this.props.auth;

    if (isAuthenticated ()) {
      if (this.state.isLoading) {
        let listUsers = await userApi.listUsers (getIdToken ());

        let body = {name: getName (), auth0: getUserId ()};

        this.setState ({users: listUsers});
        this.setState ({isLoading: false});

        let currentUser = this.userExistsCheck (body);

        if (!currentUser) {
          currentUser = await userApi.createUser (body, getIdToken ());
        }

        this.setState ({current_user: currentUser});
      }
    }
  }

  login () {
    this.props.auth.login ();
  }

  userExistsCheck (val) {
    return this.state.users.find (el => el.auth0 === val.auth0);
  }

  renderUsersList (userList) {
    console.log ('Entered renderUsersList');

    return userList.map (user => {
      return (
        <ListGroupItem key={user.id}>
          {user.name}
        </ListGroupItem>
      );
    });
  }

  render () {
    const {isAuthenticated} = this.props.auth;

    return (
      <Container>
        <Row>
          <img
            className="swayzeImage"
            src="/images/patrick-swayze.png"
            alt="The Swayze Life"
          />

        </Row>
        <br />
        <Row>
          <div className="rules">
            <h1>Taco Bingo</h1>
            <p>
              Murder is a harsh way to describe this, but Taco isn't surviving.
            </p>
            <p>
              Log in, and you'll have a a square of objectives - you want to complete a full row or column. Each time anyone completes one, its marked off for everyone.
            </p>
            <p>
              First person who achieves this, they say the drink and everyone else buys it for Taco - and it's Drink or Drown time.
            </p>
          </div>
        </Row>
        {isAuthenticated () &&
          <Row>
            <div className="players">
              <h1>Players</h1>
              <ListGroup>
                {this.state.isLoading
                  ? <ListGroupItem>'Loading users...'</ListGroupItem>
                  : this.renderUsersList (this.state.users)}
              </ListGroup>
            </div>
          </Row>}
        {!isAuthenticated () &&
          <h4>
            You are not logged in! Please{' '}
            <button
              type="button"
              className="link-button"
              style={{cursor: 'pointer'}}
              onClick={this.login.bind (this)}
            >
              Log In
            </button>
            {' '}to continue.
          </h4>}
      </Container>
    );
  }
}
