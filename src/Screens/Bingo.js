import React, { Component } from 'react';
import { LinkContainer } from "react-router-bootstrap";
import { Button } from 'react-bootstrap';
import bingoApi from '../API/Bingo';

export default class Bingo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      id: props.match.params.id,
    };
  }

  async componentDidMount() {
    const {getIdToken, isAuthenticated } = this.props.auth;

    if (isAuthenticated()) {
      if (this.state.isLoading) {
        let bingoResponse = await bingoApi.getBingo(this.state.id, getIdToken());
        this.setState({ bingo: bingoResponse })
        console.log(JSON.stringify(this.state.bingo));
        this.setState({ isLoading: false })
      }
    }
  }

  login() {
    this.props.auth.login();
  }

  async markComplete() {
    const { getIdToken } = this.props.auth;
    await bingoApi.markComplete(this.state.id, getIdToken());
    this.props.history.replace('/home')
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

  renderBingoName() {
    return (
      <h4>
        {this.state.bingo.name}
      </h4>
    );
  }

  renderBingoImage() {
    return (
      <div className="bingoImage">
        <img src={this.state.bingo.image} alt={this.state.bingo.name}/>
      </div>
    );
  }

  renderBingoBlurb() {
    return (
      <p>{this.state.bingo.blurb}</p>
    );
  }

  render() {
    const { isAuthenticated } = this.props.auth;

    return (
      <div className="container">
        {
          isAuthenticated() && !this.state.isLoading && (
            <div>
              <div>
                {this.renderBingoName()}
              </div>
              <div>
                {this.renderBingoImage()}
              </div>
              <div>
                {this.renderBingoBlurb()}
              </div>

              <Button
                id="completeBtn"
                bsStyle="primary"
                className="btn-margin"
                onClick={this.markComplete.bind(this)}>
                Complete
              </Button>
            </div>
          )
        }
      </div>
    );
  }
}