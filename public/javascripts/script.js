'use strict';

/*
  Cache default format for numeral.js currency strings
*/
const currencyFormat = '$0,0.00';

//This list matches the one found in the sever route. If you change this, change that one too
const incomeBands = [
  {
    val: 1,
    min: 0,
    max: 25000
  },
  {
    val: 2,
    min: 25001,
    max: 50000
  },
  {
    val: 3,
    min: 50001,
    max: 75000
  },
  {
    val: 4,
    min: 75001,
    max: 100000,
  },
  {
    val: 5,
    min: 100001,
    max: 150000
  },
  {
    val: 6,
    min: 150001,
    max: 1000000//equivalent of infinity
  }
];

//Set defaults for user inputs
let userInputs  = {
  distance   : "within-15km",
  income     :  50000,
  prov       : "AB",
  conflict   : 1
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

function initIncomeSlider() {
  //Init income slider and listen for changes
  const incomeSilderElem = document.querySelector("#income-slider");
  const incomeSlider = noUiSlider.create(incomeSilderElem, {
    start    : 50,
    connect  : [true, false],
    step     : 5,
    range    : {
      min : 0,
      max : 250
    }
  });

  incomeSlider.on('update', (val) => {
    const valToShow = parseInt(val[0]) * 1000;
    userInputs.income= parseInt(valToShow);
    runCalculations();
    document.querySelector('#income-slider-val').innerHTML = numeral(valToShow).format(currencyFormat);

  });
}

// Document.ready
document.addEventListener("DOMContentLoaded", function(event) {
  getData()
    .then( function (data) {
      //need to run this after data load because init triggers update for some reason
      initIncomeSlider();
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
  // document.querySelector("#select-income").addEventListener('change', function (event) {

  // });


  //Toggle full persona stories
  const storyMasks = document.querySelectorAll(".story-mask");
  Array.prototype.forEach.call(storyMasks, function (mask) {
    const toggler = mask.querySelector('.toggle-view');

    toggler.addEventListener('click', function (event) {
      event.preventDefault();

      const story = mask.parentNode.querySelector('.persona-story');
      util.removeClass(story, 'collapsed');
      mask.style.display = 'none';
    });
  });

});
