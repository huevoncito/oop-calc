const assert   = chai.assert;
const expect   = chai.expect;
let userInputs = {};

datastore = {
  personaData: [
    {
      "persona": "Aisha",
      "children": 1,
      "days-off-per-appearance": 3,
      "sick-days-per-appearance": 1,
      "payment-source": 5,
      "job-flexibility": 4,
      "job-instability": 4,
      "employed": 1,
      "health-costs": 2,
      "stage": "application",
      "health-impact": 1,
      "conflict": 1,
      "move": true,
      "Legal aid eligibaility y/n": true,
      "story": "<p>Aisha and her partner have had a rough six months, fighting a lot and have decided to separate. They have a 2 year old daughter who has been acting up because of all of the tension in the house. Her partner has moved out and Aisha and her daughter are staying in their two bedroom rental apartment. Her partner works nights, so was able to go to the courthouse and has dropped off a form for Aisha to fill out.</p><p>Aisha works in IT. She has a diploma and good job experience. She just started a new job a month ago. The hours are long and it can be high stress but she really likes her colleagues and the work is challenging. She is worried about managing her job and still getting to daycare in time to pick her daughter up on time. She has some flexibility to work from home one day a week, or to shift her hours if she checks in with her team first. She has to find a day to prepare for court, plus the day spent in court. Lately the anxiety is also affecting her health and she is taking sick time to try to get healthy.</p><p>She is feeling stressed and lonely. She has a close friend and a sister who live nearby. They both come over occasionally to help with dinner and share a bottle of wine. She would love to book a massage but she doesn’t have any benefits coverage.</p>"
    }
  ],
  provData: [
    {
      "province": "BC",
      "child-care-per-child-per-day": 48,
      "daily-income-band-1": 96,
      "daily-income-band-2": 192,
      "daily-income-band-3": 288,
      "daily-income-band-4": 384,
      "daily-income-band-5": 576,
      "daily-income-band-6": 769,
      "transport-within-5km": 10,
      "transport-within-15km": 15,
      "transport-within-50km": 30,
      "transport-within-200km": 75,
      "transport->200km": 200,
      "court-fees-by-stage-application": 200,
      "court-fees-by-stage-variation": 80,
      "court-fees-by-stage-separation-with-children": 80,
      "court-fees-by-stage-divorce": 200,
      "court-fees-by-stage-trial": 200,
      "legal-fees-by-stage-application": 3780,
      "legal-fees-by-stage-variation": 2362,
      "legal-fees-by-stage-separation-with-children": 10710,
      "legal-fees-by-stage-divorce": 3780,
      "legal-fees-by-stage-trial": 25830,
      "mediation-fees": 4423,
      "court-events-by-stage-application": 1,
      "court-events-by-stage-divorce": 6.5,
      "court-events-by-stage-separation-with-children": 10,
      "court-events-by-stage-trial": 16,
      "court-events-by-stage-variation": 8.6,
      "professional-fees-by-stage-application": 0,
      "professional-fees-by-stage-divorce": 7573,
      "professional-fees-by-stage-separation-with-children": 13681,
      "professional-fees-by-stage-variation": 6108,
      "professional-fees-by-stage-trial": 13681,
      "moving-costs": 3731,
      "legal-aid-eligibility-0-kids": 0,
      "legal-aid-eligibility-1-kids": 0,
      "legal-aid-eligibility-2+-kids": 0
    }
  ]
};
