import {config} from "../config";

class Bingo {
  async getBingo(bingoId, authIdToken) {
    let getBingoResponse = await fetch(config.apiUrl + "bingos/" + bingoId, {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + authIdToken
            }),
            mode: 'cors'
        })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            return json;
        });

    return getBingoResponse;
  }

  async markComplete(bingoId, authIdToken) {
    let getBingoResponse = await fetch(config.apiUrl + "bingos/" + bingoId + "/complete", {
            method: 'PUT',
            headers: new Headers({
                'Authorization': 'Bearer ' + authIdToken
            }),
            mode: 'cors'
        })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            return json;
        });

    return getBingoResponse;
  }


  async markUncomplete(bingoId, authIdToken) {
    let getBingoResponse = await fetch(config.apiUrl + "bingos/" + bingoId + "/uncomplete", {
            method: 'PUT',
            headers: new Headers({
                'Authorization': 'Bearer ' + authIdToken
            }),
            mode: 'cors'
        })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            return json;
        });

    return getBingoResponse;
  }
}

const bingoApi = new Bingo();
export default bingoApi;
