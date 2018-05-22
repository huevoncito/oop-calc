function calculateImpact(persona, prov = "ON") {

// -	Average number of days spent in preparation: Court events by stage * Days per appearance but if Lawyer = Yes AND Income in top band reduce by 2/3, in 5th top band, reduce by 1/3
// -	Instability Risk Factor (Job Instability + (Source of Payment rating (unless in top three income bands) + Move + Health Impact + (Job flexibility (unless in top three income bands)
// Note: for this, the higher the income band the less source of payment or job flexibility affects the Instability Risk Factor. We want a 5 level risk factor rating

  //Average number of days spent in preparation: Court events by stage * Days per appearance but if Lawyer = Yes AND Income in top band reduce by 2/3, in 5th top band, reduce by 1/3


  return {
    courtEvents: findEventsAtStage(prov, persona.stage),
    prepDays: numeral( calculatePrepDays(persona, prov) ).format('0.0'),
    instability: 0
  }

}


function calculatePrepDays(persona, prov = "ON") {
    const courtEvents      = findEventsAtStage(prov, persona.stage);
    console.log('income band', selectedIncomeBand);
    let daysPerAppearnce = persona['days-off-per-appearance'];
    if ( !!persona.lawyer ) {
      console.log( selectedIncomeBand);
      if ( selectedIncomeBand === 6 ) {
        console.log('in 6 adjust');
        daysPerAppearnce = daysPerAppearnce / 3;
      } else if ( selectedIncomeBand === 5 ) {
        console.log('in 5 adjust');
        daysPerAppearnce = 2 * (daysPerAppearnce / 3);
      }
    }

    return courtEvents * daysPerAppearnce;
}
