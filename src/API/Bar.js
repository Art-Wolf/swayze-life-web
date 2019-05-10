import {config} from '../config';

class Bar {
  async listBars (authIdToken) {
    console.log ('Entered Bar.listBars');

    let listBarsResponse = await fetch (config.apiUrl + 'bars', {
      method: 'GET',
      headers: new Headers ({
        Authorization: 'Bearer ' + authIdToken,
      }),
      mode: 'cors',
    })
      .then (response => {
        return response.json ();
      })
      .then (json => {
        let count = Object.keys (json).length;
        json.sort (
          (a, b) =>
            parseInt (a.order ? a.order : 0) - parseInt (b.order ? b.order : 0)
        );
        console.log ('API returned ' + count + ' bars.');
        return json;
      });

    return listBarsResponse;
  }

  async getBar (barId, authIdToken) {
    let getBarResponse = await fetch (config.apiUrl + 'bars/' + barId, {
      method: 'GET',
      headers: new Headers ({
        Authorization: 'Bearer ' + authIdToken,
      }),
      mode: 'cors',
    })
      .then (response => {
        return response.json ();
      })
      .then (json => {
        return json;
      });

    return getBarResponse;
  }

  async markComplete (barId, authIdToken) {
    let getBarResponse = await fetch (
      config.apiUrl + 'bars/' + barId + '/complete',
      {
        method: 'PUT',
        headers: new Headers ({
          Authorization: 'Bearer ' + authIdToken,
        }),
        mode: 'cors',
      }
    )
      .then (response => {
        return response.json ();
      })
      .then (json => {
        return json;
      });

    return getBarResponse;
  }

  async markUncomplete (barId, authIdToken) {
    let getBarResponse = await fetch (
      config.apiUrl + 'bars/' + barId + '/uncomplete',
      {
        method: 'PUT',
        headers: new Headers ({
          Authorization: 'Bearer ' + authIdToken,
        }),
        mode: 'cors',
      }
    )
      .then (response => {
        return response.json ();
      })
      .then (json => {
        return json;
      });

    return getBarResponse;
  }
}

const barApi = new Bar ();
export default barApi;
