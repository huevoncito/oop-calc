
/**
* Get a data point for a specific province
*
* @method getProvData
* @param {String} - prov - province acronym;
* @param (optional) {String} - prop - property being requested
* @return {String | Number | Boolean | Object} Returns a value if prop passed, otherwise returns the full object
*/
function getProvData(prov = "ON", prop = null) {
  const provData = _.findWhere( datastore.provData, {province: prov} );
  if ( !!prop && _.isUndefined(provData[prop]) ) {
    throw new Error(`${prop} not defined for ${prov}`);
  }
  if (!!prop && typeof provData[prop] !== 'undefined' ) {
    return provData[prop];
  }

  return provData;
}


/**
* Find number of court events for a given stage
*
* @method findEventsAtStage
* @param {String} - prov - province acronym;
* @param {String} - stage - stage being requested
* @return {Number} Returns number of events at a given stage
*/
function findEventsAtStage(prov = "ON", stage) {
  const searchString = `court-events-by-stage-${stage.toLowerCase()}`;
  return getProvData(prov, searchString);
};


/**
* Find court fees for a given stage
*
* @method findCourtFeesAtStage
* @param {String} - prov - province acronym;
* @param {String} - stage - stage being requested
* @return {Number}
*/
function findCourtFeesAtStage(prov = "ON", stage) {
  const searchString = `court-fees-by-stage-${stage.toLowerCase()}`;
  console.log(searchString);
  return getProvData(prov, searchString);
};


/**
* Find professional fees for a given stage
*
* @method findProfessionalFeesAtStage
* @param {String} - prov - province acronym;
* @param {String} - stage - stage being requested
* @return {Number}
*/
function findProfessionalFeesAtStage(prov = "ON", stage) {
  const searchString = `professional-fees-by-stage-${stage.toLowerCase()}`;
  return getProvData(prov, searchString);
};


function renderCategory({persona, category, data}) {
  for ( var prop in data ) {
    document.querySelector(`#${persona.persona}-card .${category}-${prop}`).innerHTML = data[prop];
  }

}
