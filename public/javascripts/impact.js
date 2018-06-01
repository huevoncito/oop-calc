function calculateImpact(persona, prov = "ON") {

// -	Average number of days spent in preparation: Court events by stage * Days per appearance but if Lawyer = Yes AND Income in top band reduce by 2/3, in 5th top band, reduce by 1/3
// -	Instability Risk Factor (Job Instability + (Source of Payment rating (unless in top three income bands) + Move + Health Impact + (Job flexibility (unless in top three income bands)
// Note: for this, the higher the income band the less source of payment or job flexibility affects the Instability Risk Factor. We want a 5 level risk factor rating

  //Average number of days spent in preparation: Court events by stage * Days per appearance but if Lawyer = Yes AND Income in top band reduce by 2/3, in 5th top band, reduce by 1/3
  const prepDays = calculatePrepDays(persona, prov);
  const childCareDays = calculateChildCareDays(persona, prov);

  return {
    childCareDaysLawyer   : numeral(childCareDays.lawyer).format('0.[00]'),
    childCareDaysNoLawyer : numeral(childCareDays.noLawyer).format('0.[00]'),
    courtEvents           : util.findEventsAtStage(prov, persona.stage),
    prepDaysLawyer        : numeral( prepDays.lawyer  ).format('0.[00]'),
    prepDaysNoLawyer      : numeral( prepDays.noLawyer  ).format('0.[00]'),
    instability           : calculateInstability(persona)
  }
}



function calculateInstability(persona) {
  //People above 75k don't pay health and have more flexibility
  const health = userInputs.income < 75000 && persona['health-costs'] || 1;
  const flex   = userInputs.income < 75000 && persona['job-flexibility'] || 1;

  //People above 100k don't have income source problems (eg. can pay credit)
  const source = userInputs.income < 100000 && persona['payment-source'] || 1;
  const move   = persona.move && 5 || 1;

  const score = health + move + source + flex + persona['health-impact'] + persona['job-instability'];

  if ( score < 10 ) {
    return "Low";
  } else if ( score < 20 ) {
    return "Medium";
  } else {
    return "High";
  }

}


///TODO: WITH AND WITHOUT LAWYER
function calculatePrepDays(persona, prov = "ON") {
    const courtEvents    = util.findEventsAtStage(prov, persona.stage);
    const daysPerAppearance = persona['days-off-per-appearance'];
    const daysPerAppearanceWithLawyer = util.adjustForLawyer(daysPerAppearance);

    //return with lawyer, and without lawyer
    return {
      lawyer  : courtEvents * daysPerAppearance,
      noLawyer : courtEvents * daysPerAppearanceWithLawyer
    }
}
