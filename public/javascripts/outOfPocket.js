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
  const fees       = calculateFees(persona, prov);
  const transport  = calculateTransportCost(persona, prov);
  const lostIncome = calculateLostIncome(persona, prov);
  const moving     = calculateMovingCost(persona, prov);

  return {
    total      : numeral(childCare + fees + transport + lostIncome + moving).format(currencyFormat),
    childCare  : numeral(childCare).format(currencyFormat),
    fees       : numeral(fees).format(currencyFormat),
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
    const eventsAtStage = util.findEventsAtStage(prov, persona.stage);
    const careCost      = util.getProvData(prov, 'child-care-per-child-per-day');

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
    const courtFeesAtStage = util.findCourtFeesAtStage(prov, persona.stage);
    const profFeesAtStage  = util.findProfessionalFeesAtStage(prov, persona.stage);
    const legalFees        = calculateLegalFees(persona, prov);

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

/*
  Legal Aid Calculation
  1) Legal aid eligibility (is personal ruled out?)
  2) Do they qualify for legal aid based on number of children and prvovincial salary cutoff
  3) If eligible, OR does not have lawyer, legal fee is 0
  4) Otherwise get legal fee based on stage, adjusted by conflict multipler

*/
function calculateLegalFees(persona, prov = "ON") {
    const conflictString = persona.conflict == 'h' && 'high-conflict' || 'low-conflict';
    const searchString   = `litigation-fees-${conflictString}`;
    return util.getProvData(prov, searchString);
}




//Transportation (Court events by stage * Distance from courthouse)
function calculateTransportCost(persona, prov) {
  const eventsAtStage = util.findEventsAtStage(prov, persona.stage);
  const transportCost = util.getProvData(prov, `transport-${userInputs.distance}`);
  return eventsAtStage * transportCost;
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

  const eventsAtStage = util.findEventsAtStage(prov, persona.stage);
  const income        = util.getProvData(prov, `daily-income-band-` + userInputs.incomeBand) * persona.employed;
  const paidWageLost  = eventsAtStage * persona['days-off-per-appearance'] * income;
  const sickDaysLost  = eventsAtStage * persona['sick-days-per-appearance'] * income;

  return paidWageLost + sickDaysLost;
}


//Caculatae moving cost
function calculateMovingCost(persona, prov) {
  return !!persona.move && util.getProvData(prov, "moving-costs") || 0;
}
