import React, {Component} from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import {Col, Container, Row} from 'reactstrap';
import userApi from '../API/User';

export default class Game extends Component {
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

        this.setState ({users: listUsers});
        let body = {name: getName (), auth0: getUserId ()};

        let currentUser = this.userExistsCheck (body);

        if (!currentUser) {
          userApi.createUser (body, getIdToken ());
        } else {
          this.setState ({current_user: currentUser});
        }

        this.setState ({isLoading: false});
      }
    }
  }

  login () {
    this.props.auth.login ();
  }

  userExistsCheck (val) {
    console.log ('Checking for: ' + val.name + ', ' + val.auth0);

    return this.state.users.find (el => el.auth0 === val.auth0);
  }

  renderBingoGrid (bingoList, min, max) {
    return [{}].concat (bingoList).map (
      (bingo, i) =>
        i !== 0 && i >= min && i <= max
          ? <Col key={i}>
              <div
                className={
                  'column ' + (bingo.completed ? 'bingoCompleted' : '')
                }
                key={i}
              >
                <LinkContainer key={bingo.id} to={`/bingo/${bingo.id}`}>
                  <img src={bingo.icon} alt={bingo.name} />
                </LinkContainer>
              </div>
            </Col>
          : ''
    );
  }

  renderSquaresToGo () {
    const {getName} = this.props.auth;

    if (this.state.current_user) {
      let currentSquares =
        getName () + ', you need ' + this.state.current_user.squaresToGo;

      if (this.state.current_user.squaresToGo > 1) {
        currentSquares += ' more squares!';
      } else if (this.state.current_user.squaresToGo === 1) {
        currentSquares += ' more square!';
      } else if (this.state.current_user.squaresToGo === 0) {
        currentSquares = getName () + ', CONGRATS! You won!';
      }

      return (
        <h4>
          {currentSquares}
        </h4>
      );
    }
  }

  render () {
    const {isAuthenticated} = this.props.auth;

    console.log (this.state.current_user);

    return (
      <Container>
        <div className="page-header">
          <h1>Taco Bingo</h1>
        </div>
        <div className="text-center">
        {isAuthenticated () &&
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
              {this.renderSquaresToGo ()}
            </Row>
            <br />
            <Row>
              {this.state.current_user
                ? this.renderBingoGrid (this.state.current_user.bingoList, 1, 4)
                : ''}
            </Row><Row>
              {this.state.current_user
                ? this.renderBingoGrid (this.state.current_user.bingoList, 5, 8)
                : ''}
            </Row><Row>
              {this.state.current_user
                ? this.renderBingoGrid (
                    this.state.current_user.bingoList,
                    9,
                    12
                  )
                : ''}
            </Row><Row>
              {this.state.current_user
                ? this.renderBingoGrid (
                    this.state.current_user.bingoList,
                    13,
                    16
                  )
                : ''}
            </Row>
          </Container>}
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
          </div>
      </Container>
    );
  }
}
