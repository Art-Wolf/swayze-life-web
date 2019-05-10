import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import barApi from '../API/Bar';

export default class Bar extends Component {
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
        let barResponse = await barApi.getBar (this.state.id, getIdToken ());
        this.setState ({bar: barResponse});
        console.log (JSON.stringify (this.state.bar));
        this.setState ({isLoading: false});
      }
    }
  }

  login () {
    this.props.auth.login ();
  }

  async markComplete () {
    const {getIdToken} = this.props.auth;
    await barApi.markComplete (this.state.id, getIdToken ());
    this.props.history.replace ('/bars');
  }

  async markUncomplete () {
    const {getIdToken} = this.props.auth;
    await barApi.markUncomplete (this.state.id, getIdToken ());
    this.props.history.replace ('/bars');
  }

  renderBarName () {
    return (
      <h4>
        {this.state.bar.name}
      </h4>
    );
  }

  renderBarAddress () {
    return (
      <div className="barAddress">
        <p>{this.state.bar.address}</p>
      </div>
    );
  }

  render () {
    const {isAuthenticated} = this.props.auth;

    return (
      <div className="container">
        {isAuthenticated () &&
          !this.state.isLoading &&
          <div>
            <div>
              {this.renderBarName ()}
            </div>
            <div>
              {this.renderBarAddress ()}
            </div>

            {this.state.bar.complete
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
          </div>}
      </div>
    );
  }
}
