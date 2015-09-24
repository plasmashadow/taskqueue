module.exports = function Factory(queue){
  return new TaskQueue(queue);
}

var kue = require('kue');
var $ = require('jquery-deferred');
var Emitter = require('events').EventEmitter;
var assign = require('object-assign');

function TaskQueue(queue){
  queue = queue || (function(){
    return kue.createQueue();
  });

  this._defaults = {
     priority: 'normal',
     attempts: 1,
     delay: 1,
     backoff: {type: 'exponential'}
  }

  this.queue = queue;
  this.jobs = [];
}

TaskQueue.prototype = new Emitter;

TaskQueue.prototype.add = function(name, data, fn, options){
  if(!(name in this.jobs)){
    this.emit('add', {
      name: name
    });
    this.jobs.push(name);
    this.queue.progress(name, function(job, done){
       fn(job, done);
    });
  }

  options = assign({}, this._defaults, options);

  var async = $.Deferred();

  var job = this.queue.create(name, data)
            .priority(options.priority)
            .attempts(options.attempts)
            .ttl(options.delay)
            .backoff(options.backoff);

  var that = this;

  job = job.save(function(err){
    if(err){
      that.emit('error', err);
    }
    else{
      that.emit('save', {name: name, data: data});
    }
  });


  job.on('complete', function(){
    async.resolve();
  });

  job.on('failed', function(err){
    async.reject(err);
  })

  job.on('failed attempt', function(err, attempts){
    async.notify({error: err, attempt: attempts}, null , null);
  });

  job.on('progress', function(progress, data){
    async.notify(null, progress, data);
  })

  return async.promise();
}
