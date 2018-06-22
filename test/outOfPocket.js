describe('Out of pocket', function () {

  let stubs = {};
  let personaUnderTest;

  beforeEach( function () {
    stubs['findEventsAtStage'] = sinon.stub(util, 'findEventsAtStage').returns(5);
    stubs['prepDays']          = sinon.stub(window, 'calculatePrepDays').returns({lawyer: 2, noLawyer: 5});
    stubs['getProvData']       = sinon.spy(stub, 'getProvData');
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
      datastore.provData[0]['child-care-per-child-per-day'] = 200;

      const result = calculateChildCareCost(personaUnderTest, "BC");

      assert( childCareDaysStub.calledWith(personaUnderTest, "BC") );
      assert( getProvData.calledWith("BC", "child-care-per-child-per-day") );
      assert.isObject( result );
      //childCount = 2, days with lawyer = 5, days without lawyer = 10, careCost = 200;
      assert.equal( result.lawyer, 2 * 5 * 200 );
      assert.equal( result.noLawyer 2 * 10 * 200)

      childCareDaysStub.restore();
    });
  });
});
