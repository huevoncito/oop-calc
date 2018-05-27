'use strict';

/*
  Cache default format for numeral.js currency strings
*/
const currencyFormat = '$0,0.00';

//Set defaults for user inputs
let userInputs  = {
  distance   : "within-15km",
  incomeBand : 3,
  prov       : "AB"
};


//run all the calculations and render them to the DOM
function runCalculations() {
  datastore.personaData.forEach( persona => {
    //run the numbers
    const oop    = calculateOutOfPocket(persona, userInputs.prov);
    const impact = calculateImpact(persona, userInputs.prov);

    //render 'em
    util.renderCategory( {persona, category: "oop", data: oop} );
    util.renderCategory( {persona, category: "impact", data: impact });
  });
}

// Document.ready
document.addEventListener("DOMContentLoaded", function(event) {
  getData()
    .then( function (data) {
      runCalculations();
    });

  // Listen for Province Change
  document.querySelector("#select-province").addEventListener('change', function (event) {
    userInputs.prov = event.target.value;
    runCalculations();
  });

  // Listen for Distance Change
  document.querySelector("#select-distance").addEventListener('change', function (event) {
    userInputs.distance = event.target.value;
    runCalculations();
  });

  // Listen for Income Change
  document.querySelector("#select-income").addEventListener('change', function (event) {
    userInputs.incomeBand = parseInt(event.target.value);
    runCalculations();
  });
});
