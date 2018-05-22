const defaults = {
  distance: "within-15km",
  incomeBand: 3,
  prov: "AB"
};

let selectedProv       = defaults.prov;
let selectedDistance   = defaults.distance;
let selectedIncomeBand = defaults.incomeBand

const currencyFormat = '$0,0.00';


//instability
//




function runCalculations(persona) {
  //run all the calculations
  const oop = calculateOutOfPocket(persona, selectedProv);
  const impact = calculateImpact(persona, selectedProv);

  renderCategory( {persona, category: "oop", data: oop} );
  renderCategory( {persona, category: "impact", data: impact });
}

function init() {
  datastore.personaData.forEach( function (persona) {
    console.log("Running" + persona.persona);
    runCalculations(persona);
  });
}


document.addEventListener("DOMContentLoaded", function(event) {
  getData();
  let timer = setInterval( function () {
    if ( !dataFetched ) return;

    clearInterval(timer);
    init();
  }, 100);

  document.querySelector("#select-province").addEventListener('change', function (event) {
    selectedProv = event.target.value;
    init();
  });

  document.querySelector("#select-distance").addEventListener('change', function (event) {
    selectedDistance = event.target.value;
    init();
  });

  document.querySelector("#select-income").addEventListener('change', function (event) {
    selectedIncomeBand = parseInt(event.target.value);
    init();
  });

});
