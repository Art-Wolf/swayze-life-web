import GoogleMap from 'google-map-react';
import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import barApi from '../API/Bar';
import {config} from '../config';
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
        let newCenter = {
          lat: parseFloat (this.state.bar.lat),
          lng: parseFloat (this.state.bar.long),
        };
        console.log (JSON.stringify (newCenter));
        this.setState ({
          center: newCenter,
        });
        this.setState ({zoom: 17});
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
      <div className="page-header">
        <h1>{this.state.bar.name}</h1>
      </div>
    );
  }

  renderBarAddress () {
    return (
      <div className="barAddress">
        <p><b>Address</b>: {this.state.bar.address}</p>
      </div>
    );
  }

  renderMarker = (map, maps) => {
    new maps.Marker ({
      map: map,
      position: new maps.LatLng (this.state.bar.lat, this.state.bar.long),
      title: 'Empire',
    });
  };

  renderBarMap () {
    return (
      <div>
        {!this.state.isLoading &&
          <div style={{height: '50vh', width: '100%'}}>
            <GoogleMap
              bootstrapURLKeys={{
                key: config.mapsKey,
              }}
              defaultCenter={this.state.center}
              defaultZoom={this.state.zoom}
              yesIWantToUseGoogleMapApiInternals={true}
              onGoogleApiLoaded={({map, maps}) => this.renderMarker (map, maps)}
            />
          </div>}
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
            <div>
              {this.renderBarMap ()}
            </div>

            <div className="text-center">
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
            </div>
          </div>}
      </div>
    );
  }
}
