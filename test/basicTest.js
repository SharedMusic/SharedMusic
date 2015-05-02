var should = require('should');
  
describe("Basic Test",function(){

  it('This should pass!',function(done){
    var flag = true;


    flag.should.equal(true);
    done();
  });

  it('This should NOT pass (for initial circleCI setup purposes)!',function(done){
    var flag = true;


    flag.should.equal(false);
    done();
  });
});
