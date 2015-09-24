var taskqueue = require('./index.js')();

exports.testQueue = function(beforeExit, assert){
  var flag = false;
  var async = taskqueue.add('task', {id: 1}, function(job, done){
    console.log(job);
    flag= true;
    done();
  }, {});

  async.done(function(result){
    assert.ok(flag == true);
  })
}
