import React, {Component} from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import {Container, ListGroup, ListGroupItem} from 'reactstrap';
import barApi from '../API/Bar';

export default class BarList extends Component {
  constructor (props) {
    super (props);
    this.state = {
      isLoading: true,
    };
  }

  async componentDidMount () {
    const {getIdToken, isAuthenticated} = this.props.auth;

    if (isAuthenticated ()) {
      if (this.state.isLoading) {
        let listBars = await barApi.listBars (getIdToken ());

        this.setState ({bars: listBars});
        this.setState ({isLoading: false});
      }
    }
  }

  login () {
    this.props.auth.login ();
  }

  renderBarList () {
    return [{}].concat (this.state.bars).map (
      (bar, i) =>
        i !== 0
          ? <div className={bar.complete ? 'barCompleted' : ''} key={i}>
              <ListGroupItem>
                <LinkContainer key={bar.id} to={`/bar/${bar.id}`}>
                  <h4>{bar.name}</h4>
                </LinkContainer>
              </ListGroupItem>
            </div>
          : ''
    );
  }

  render () {
    const {isAuthenticated} = this.props.auth;

    return (
      <Container>
        <div className="page-header">
          <h1>Bar List</h1>
        </div>
        {isAuthenticated () &&
          !this.state.isLoading &&
          <div>
            <ListGroup>
              {this.renderBarList ()}
            </ListGroup>
          </div>}
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
