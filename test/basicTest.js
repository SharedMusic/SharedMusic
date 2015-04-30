var should = require('should');
  
describe("Basic Test",function(){

  it('This should pass!',function(done){
    var flag = true;

    flag.should.equal(true);
    done();
  });
});