describe('Util', function() {
  let findWhereSpy, getProvDataSpy;
  beforeEach(function () {
    findWhereSpy   = sinon.stub(_, "findWhere").returns(datastore.provData[0]);
    getProvDataSpy = sinon.spy(util, 'getProvData');
  });
  afterEach(function () {
    findWhereSpy.restore();
    getProvDataSpy.restore();
  });

  describe('getProvData', function () {
    it('throws if prop is falsy', function () {
      assert.throws(function () {
        util.getProvData("ON");
      });
    });
    it('calls _findWhere to get the province data', function() {
      //need to return actual data, otherwise the function throws after this bit that we're testing
      util.getProvData("BC", "mediation-fees");
      assert.isTrue( findWhereSpy.calledWith(datastore.provData, {province: "BC"}) );
    });
    it('throws if the prop is not defined in the provData', function () {
      assert.throws(function () {
        util.getProvData("BC", "propThatDoesNotExist");
      });
    });

    it('returns the value of the passed prop', function () {
      datastore.provData[0]['mediation-fees'] = 200;
      const val = util.getProvData("BC", "mediation-fees");
      assert.equal(val, 200);
    });
  });

  describe('findEventsAtStage', function () {
    it('should call getProvData with the correct search string and return the correct value', function () {
      datastore.provData[0]['court-events-by-stage-application'] = 2;
      const val = util.findEventsAtStage('BC', 'application');
      assert.isTrue(getProvDataSpy.calledWith("BC", "court-events-by-stage-application"));
      assert.equal(val, 2);
    });
  });

  describe('findCourtFeesAtStage', function () {
    it('should call getProvData with the correct search string and return the correct value', function () {
      datastore.provData[0]['court-fees-by-stage-application'] = 2;
      const val = util.findCourtFeesAtStage('BC', 'application');
      assert.isTrue(getProvDataSpy.calledWith("BC", "court-fees-by-stage-application"));
      assert.equal(val, 2);
    });
  });

  describe('findProfessionalFeesAtStage', function () {
    it('should call getProvData with the correct search string and return the correct value', function () {
      datastore.provData[0]['professional-fees-by-stage-application'] = 1234;
      const val = util.findProfessionalFeesAtStage('BC', 'application');
      assert.isTrue(getProvDataSpy.calledWith("BC", "professional-fees-by-stage-application"));
      assert.equal(val, 1234);
    });
  });

  describe('findLegalFeesAtStage', function () {
    it('should call getProvData with the correct search string and return the correct value', function () {
      datastore.provData[0]['legal-fees-by-stage-application'] = 4321;
      const val = util.findLegalFeesAtStage('BC', 'application');
      assert.isTrue(getProvDataSpy.calledWith("BC", "legal-fees-by-stage-application"));
      assert.equal(val, 4321);
    });
  });

  describe('adjustForLawyer', function () {
    it("should return the passed figure if user income < 75k", function () {
      userInputs.income = 75000 - 1;
      assert.equal( util.adjustForLawyer(5), 5 );
    });
    it('should reduce the passed figure by 1/3 if user income between 75k and 100k', function () {
      userInputs.income = 75000 + 1;
      assert.equal( util.adjustForLawyer(6), 4 );
    });

    it('should reduce the passed figure by 2/3 if user income between 75k and 100k', function () {
      userInputs.income = 100000 + 1;
      assert.equal( util.adjustForLawyer(6), 2 );
    });
  });
});
