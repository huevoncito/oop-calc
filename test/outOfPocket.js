describe('Out of pocket', function () {

  let stubs = {};
  let personaUnderTest;

  beforeEach( function () {
    stubs['findEventsAtStage'] = sinon.stub(util, 'findEventsAtStage').returns(5);
    stubs['prepDays']          = sinon.stub(window, 'calculatePrepDays').returns({lawyer: 2, noLawyer: 5});
    stubs['getProvData']       = sinon.stub(util, 'getProvData');
    personaUnderTest           = datastore.personaData[0];
  });

  afterEach( function () {
    for ( var key in stubs ) {
      stubs[key].restore();
    }
  });


  describe('calculateChildCareDays', function () {
    it ('should return zero if persona has no kids', function () {
      personaUnderTest.children = 0;
      assert.equal( calculateChildCareDays(personaUnderTest, "BC"), 0 );
    });
    it("should call util.findEventsAtStage, calculatePrepDays, and return values for lawyer and no lawyer", function () {
      personaUnderTest.children = 1;
      personaUnderTest.stage    = "application";
      const childCareDays       = calculateChildCareDays(personaUnderTest, "BC");
      assert( stubs['findEventsAtStage'].calledWith("BC", "application") );
      assert( stubs['prepDays'].calledWith(personaUnderTest, "BC") );
      assert.isObject( childCareDays );
      assert.equal(childCareDays.lawyer, 5 + 2 );
      assert.equal(childCareDays.noLawyer, 5 + 5 );
    });
  });

  describe('calculateChildCareCost', function () {

    it("should call calculateChildCareDays, getProvData, and return values for lawyer and no lawyer", function () {
      let childCareDaysStub = sinon.stub(window, 'calculateChildCareDays')
        .returns({lawyer : 5, noLawyer: 10});

      personaUnderTest.children = 2;
      personaUnderTest.stage    = "application";

      stubs['getProvData'].withArgs("BC", "child-care-per-child-per-day").returns(200);

      const result = calculateChildCareCost(personaUnderTest, "BC");

      assert( childCareDaysStub.calledWith(personaUnderTest, "BC") );
      assert( stubs['getProvData'].calledWith("BC", "child-care-per-child-per-day") );
      assert.isObject( result );
      //childCount = 2, days with lawyer = 5, days without lawyer = 10, careCost = 200;
      assert.equal( result.lawyer, 2 * 5 * 200 );
      assert.equal( result.noLawyer, 2 * 10 * 200);

      childCareDaysStub.restore();
    });
  });

  describe('getLegalAidEligibility', function () {
    it('should return false if persona is not legal aid eligible', function () {
      personaUnderTest['legal-aid-eligible'] = false;
      assert.isFalse( getLegalAidEligibility(personaUnderTest, "BC") );
    });
    it("should call getProvData for correct number of kids", function () {
      personaUnderTest.children              = 1;
      personaUnderTest['legal-aid-eligible'] = true;
      getLegalAidEligibility( personaUnderTest, "BC" );
      assert.isTrue( stubs['getProvData'].calledWith("BC", "legal-aid-eligibility-1-kids" ) );

      personaUnderTest.children              = 3;
      getLegalAidEligibility( personaUnderTest, "BC" );
      assert.isTrue( stubs['getProvData'].calledWith("BC", "legal-aid-eligibility-2+-kids" ) );
    });
    it("should return true if income < cutoff", function () {
      personaUnderTest.children              = 1;
      personaUnderTest['legal-aid-eligible'] = true;
      userInputs.income                      = 4999;
      stubs['getProvData']
        .withArgs("BC", "legal-aid-eligibility-1-kids")
        .returns(5000);

      assert.isTrue( getLegalAidEligibility(personaUnderTest, "BC") );
    });
    it("should return false if income >= cutoff", function () {
      personaUnderTest.children              = 1;
      personaUnderTest['legal-aid-eligible'] = true;
      userInputs.income                      = 5001;
      stubs['getProvData']
        .withArgs("BC", "legal-aid-eligibility-1-kids")
        .returns(5000);

      assert.isFalse( getLegalAidEligibility(personaUnderTest, "BC") );
    });
  });


  describe("calculateLegalFees", function () {
    let feeStubs = {};

    beforeEach(function () {
      feeStubs['legalAidElgiblility']  = sinon.stub(window, 'getLegalAidEligibility');
      feeStubs['findLegalFeesAtStage'] = sinon.stub(util, 'findLegalFeesAtStage').returns(2000);
      feeStubs['findCourtFeesAtStage'] = sinon.stub(util, 'findCourtFeesAtStage').returns(500);
      feeStubs['findProfessionalFeesAtStage'] = sinon.stub(util, 'findProfessionalFeesAtStage').returns(1000);
    });

    afterEach(function () {
      for ( var key in feeStubs ) {
        feeStubs[key].restore();
      }
    });

    it('should get legal aid eligibility', function () {
      calculateLegalFees(personaUnderTest, "BC");
      assert( feeStubs['legalAidElgiblility'].calledWith(personaUnderTest, "BC") );
    });
    it('should findLegalFeesAtStage', function () {
      calculateLegalFees(personaUnderTest, "BC");
      assert( feeStubs['findLegalFeesAtStage'].calledWith("BC", personaUnderTest.stage) );
    });
    it( 'should findCourtFeesAtStage', function () {
      calculateLegalFees(personaUnderTest, "BC");
      assert( feeStubs['findCourtFeesAtStage'].calledWith("BC", personaUnderTest.stage) );
    });
    it("should findProfessionalFeesAtStage", function () {
      calculateLegalFees(personaUnderTest, "BC");
      assert( feeStubs['findProfessionalFeesAtStage'].calledWith("BC", personaUnderTest.stage) );
    });

    it("should return values if legalAidElgible", function () {
      //assumes legal fees 2000, court fees 500, professional fees 1000
      feeStubs['legalAidElgiblility'].returns(true);
      const result = calculateLegalFees(personaUnderTest, "BC");

      assert.isObject(result);

      //these should be the same
      assert.equal( result.noLawyer, 500 + 1000 );
      assert.equal( result.lawyer, 500 + 1000 )
    });

    it("should return values if not legalAidElgible", function () {
      //assumes legal fees 2000, court fees 500, professional fees 1000
      personaUnderTest.conflict = 2; //arbitrary
      feeStubs['legalAidElgiblility'].returns(false);
      const result = calculateLegalFees(personaUnderTest, "BC");

      assert.isObject(result);

      //these should be the same
      assert.equal( result.noLawyer, 500 + 1000 );
      assert.equal( result.lawyer, 2000 * 2 * 1 + (500 + 1000) )
    });
  });


});
