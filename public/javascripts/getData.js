let dataFetched = false;
let datastore   = {};

/**
* Fetch CSV data from the server and stash in datastore
*
* @method getData
*/
function getData() {
  //mark this as false to pause action
  dataFetched = false;

  //get the data
  fetch('/data')
    .then( result => {
      // convert to JSON
      return result.json();
    }).then( data => {
      // stash in the datastore
      datastore = data;
      //mark fetched as true so calculations can proceed
      dataFetched = true;

    });
}
