import React, {Component} from 'react';
import {Button, Image} from 'react-bootstrap';
import {Container} from 'reactstrap';
import bingoApi from '../API/Bingo';
export default class Bingo extends Component {
  constructor (props) {
    super (props);

    this.state = {
      isLoading: true,
      id: props.match.params.id,
    };
  }

  async componentDidMount () {
    const {getIdToken, isAuthenticated} = this.props.auth;

    if (isAuthenticated ()) {
      if (this.state.isLoading) {
        let bingoResponse = await bingoApi.getBingo (
          this.state.id,
          getIdToken ()
        );
        this.setState ({bingo: bingoResponse});
        console.log (JSON.stringify (this.state.bingo));
        this.setState ({isLoading: false});
      }
    }
  }

  login () {
    this.props.auth.login ();
  }

  async markComplete () {
    const {getIdToken} = this.props.auth;
    await bingoApi.markComplete (this.state.id, getIdToken ());
    this.props.history.replace ('/game');
  }

  async markUncomplete () {
    const {getIdToken} = this.props.auth;
    await bingoApi.markUncomplete (this.state.id, getIdToken ());
    this.props.history.replace ('/game');
  }

  renderBingoName () {
    return (
      <div className="page-header">
        <h1>{this.state.bingo.name}</h1>
      </div>
    );
  }

  renderBingoImage () {
    return (
      <div className="bingoImage">
        <Image
          src={this.state.bingo.image}
          alt={this.state.bingo.name}
          rounded
        />
      </div>
    );
  }

  renderBingoBlurb () {
    return (
      <div>
        <div className="page-header">
          <h3>Description</h3>
        </div>
        <p>{this.state.bingo.blurb}</p>
      </div>
    );
  }

  render () {
    const {isAuthenticated} = this.props.auth;

    return (
      <Container>
        {isAuthenticated () &&
          !this.state.isLoading &&
          <div>
            <div>
              {this.renderBingoName ()}
            </div>
            <div>
              {this.renderBingoImage ()}
            </div>
            <div>
              {this.renderBingoBlurb ()}
            </div>

            <div className="text-center">
              {this.state.bingo.completed
                ? <Button
                    id="completeBtn"
                    bsStyle="warning"
                    className="btn-margin"
                    onClick={this.markUncomplete.bind (this)}
                  >
                    Bah - not actually complete
                  </Button>
                : <Button
                    id="completeBtn"
                    bsStyle="success"
                    className="btn-margin"
                    onClick={this.markComplete.bind (this)}
                  >
                    Complete
                  </Button>}
            </div>
          </div>}
      </Container>
    );
  }
}
