import React, { Component } from 'react';
import { LinkContainer } from "react-router-bootstrap";

export default class Bingo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      id: props.match.params.id,
    };
  }

  componentDidMount() {
    const { isAuthenticated } = this.props.auth;

    if (isAuthenticated()) {
      if (this.state.isLoading) {
        this.getLoadedBingo();
      }
    }
  }

  login() {
    this.props.auth.login();
  }

  getLoadedBingo() {
    const { getIdToken } = this.props.auth;

    fetch("https://klf0b851mc.execute-api.us-east-1.amazonaws.com/dev/bingos/" + this.state.id, {
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
            this.setState({ bingo: json })
            console.log(JSON.stringify(this.state.bingo));
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

  renderBingoName() {
    return (
      <h4>
        {this.state.bingo.name}
      </h4>
    );
  }

  renderBingoImage() {
    return (
      <div>
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
            </div>
          )
        }
      </div>
    );
  }
}
