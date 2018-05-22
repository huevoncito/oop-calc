const defaults = {
  distance: 10,
  incomeBand: 3,
  prov: "ON"
};

const currencyFormat = '$0,0.00';
let distance         = defaults.distance;

//instability
//




function runCalculations(persona) {
  //run all the calculations
  const oop = calculateOutOfPocket(persona, "ON");
  renderCategory( {persona, category: "oop", data: oop} );
}


document.addEventListener("DOMContentLoaded", function(event) {
  getData();
  let timer = setInterval( function () {
    if ( !dataFetched ) return;

    clearInterval(timer);
    datastore.personaData.forEach( function (persona) {
      console.log("Running" + persona.persona);
      runCalculations(persona);
    });

  }, 100);
});
