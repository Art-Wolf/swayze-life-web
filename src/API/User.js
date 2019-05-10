import {config} from '../config';

class User {
  async createUser (user, authIdToken) {
    let createUserResponse = await fetch (config.apiUrl + 'users', {
      method: 'POST',
      headers: new Headers ({
        Authorization: 'Bearer ' + authIdToken,
        'Content-Type': 'application/json',
      }),
      mode: 'cors',
      body: JSON.stringify (user),
    })
      .then (response => {
        return response.json ();
      })
      .then (json => {
        return json;
      });

    return createUserResponse;
  }

  async listUsers (authIdToken) {
    console.log ('Entered User.listUsers');

    let listUsersResponse = await fetch (config.apiUrl + 'users', {
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
            parseInt (a.squaresToGo ? a.squaresToGo : 0) -
            parseInt (b.squaresToGo ? b.squaresToGo : 0)
        );
        console.log ('API returned ' + count + ' users.');
        return json;
      });

    return listUsersResponse;
  }
}

const userApi = new User ();
export default userApi;
