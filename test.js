var taskqueue = require('./index.js')();
var assert = require('assert');

describe('should route the job correctly', function() {

  it('kue test', function(done) {
    var flag = false;
    var async = taskqueue.add('task', {
      id: 1
    }, function(job, dn) {
      flag = true;
      dn();
    }, {});

    async.done(function(result) {
      assert.ok(flag == true);
      done();
    })
  });

});
