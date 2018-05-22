/**
* Calculate Out of Pocket Expenses
*
* @method calculateOutOfPocket
* @param {Object} - persona
* @param {String} - prov
* @return {Number} Out of pocket expenses
*/
function calculateOutOfPocket(persona, prov = "ON") {
  const childCare  = calculateChildCareCost(persona, prov);
  // const fees       = calculateFees(persona, prov);
  const transport  = calculateTransportCost(persona, prov);
  const lostIncome = calculateLostIncome(persona, prov);
  const moving     = calculateMovingCost(persona, prov);

  // console.log({
  //   total: childCare + fees + transport + lostIncome + moving,
  //   childCare,
  //   // fees,
  //   transport,
  //   lostIncome,
  //   moving
  // });

  return {
    total      : numeral(childCare /*+ fees*/ + transport + lostIncome + moving).format(currencyFormat),
    childCare  : numeral(childCare).format(currencyFormat),
    // fees,
    transport  : numeral(transport).format(currencyFormat),
    lostIncome : numeral(lostIncome).format(currencyFormat),
    moving     : numeral(moving).format(currencyFormat)
  };
}


/**
* Calculate the cost of childcare for a persona in a province
*
* @method calculateChildCareCost
* @param {Object} - persona - persona for whom the cost will be calculated
* @param {String} - prov - acronym of province
* @return {Number} Returns number of events at a given stage
*/
function calculateChildCareCost(persona, prov = "ON") {
    const childCount    = persona.children || 0;
    const eventsAtStage = findEventsAtStage(prov, persona.stage);
    const careCost      = getProvData(prov, 'child-care-per-child-per-day');

    return childCount * eventsAtStage * careCost;
}



/**
* Calculate fees for a persona in a province
*
* @method calculateFees
* @param {Object} - persona - persona for whom the cost will be calculated
* @param {String} - prov - acronym of province
* @return {Number} Returns number of events at a given stage
*/
function calculateFees(persona, prov = "ON") {
  /*(
    Persona stage of process -
      stage of process court fees of selected province
      + Professional fees by stage of process
      + (Persona Low / High Conflict * legal fees H / L of selected province)
    */
    //TODO COURT FEES FOR "DIVORCE WITH CHILDREN" not defined
    const courtFeesAtStage = findCourtFeesAtStage(prov, persona.stage);
    const profFeesAtStage = findProfessionalFeesAtStage(prov, persona.stage);
    const legalFees = calculateLegalFees(persona, prov);

    console.log(courtFeesAtStage, profFeesAtStage, legalFees);

    return courtFeesAtStage + profFeesAtStage + legalFees;
}


/**

* Calculate legal fees for a persona in a province
*
* @method calculateLegalFees
* @param {Object} - persona - persona for whom the cost will be calculated
* @param {String} - prov - acronym of province
* @return {Number} Legal fees
*/
function calculateLegalFees(persona, prov = "ON") {
    const conflictString = persona.conflict == 'h' && 'high-conflict' || 'low-conflict';
    const searchString   = `litigation-fees-${conflictString}`;
    return getProvData(prov, searchString);
}




//Transportation (Court events by stage * Distance from courthouse)
function calculateTransportCost(persona, prov) {
  const eventsAtStage = findEventsAtStage(prov, persona.stage);
  return eventsAtStage * getTransportCost(prov);
}


function getTransportCost(prov) {
  let searchString = `transport`;
  if ( distance <= 5 ) {
    searchString += '-within-5km';
  } else if ( distance <= 15 ) {
    searchString += '-within-15km';
  } else if ( distance <= 50 ) {
    searchString += '-within-50km';
  } else if ( distance <= 200 ) {
    searchString += '-within-200km';
  } else if ( distance > 200 ) {
    searchString += '>200km';
  }

  return getProvData(prov, searchString);
}

/*
•	Lost income (
  Employed Y / N + (
    (Court events by stage * Days per appearance) * selected daily income band
  ) + (
    (Court events by stage * Sick Days) * selected daily income band
  )
*/
function calculateLostIncome( persona, prov ) {
  if ( !persona.employed ) return 0;

  const eventsAtStage = findEventsAtStage(prov, persona.stage);
  const income        = getProvData(prov, `daily-income-band-` + persona['payment-source']);
  const paidWageLost  = eventsAtStage * persona['days-off-per-appearance'] * income;
  const sickDaysLost  = eventsAtStage * persona['sick-days-per-appearance'] * income;

  return paidWageLost + sickDaysLost;
}


//Caculatae moving cost
function calculateMovingCost(persona, prov) {
  return !!persona.move && getProvData(prov, "moving-costs") || 0;
}
