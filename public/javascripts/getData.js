let dataFetched = false;
let datastore   = {};

/**
* Fetch CSV data from the server and stash in datastore
*
* @method getData
*/
function getData() {

  return fetch('/data')
    .then( result => {
      // convert to JSON
      return result.json();
    }).then( data => {
      // stash in the datastore
      datastore = data;
    });
}
