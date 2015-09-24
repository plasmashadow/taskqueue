##TaskQueue
[![Build Status](https://travis-ci.org/plasmashadow/taskqueue.svg)](https://travis-ci.org/plasmashadow/taskqueue)

##Installation

```
npm install taskqueue.js
```

##Usage

```javascript

 var taskqueue = require('taskqueue.js')();


 var async = taskqueue.add('route', {
   url: '/account/1',
   params: {abc: "def"}
 }, function(job, done){
    console.log(job.id);
    done();
 })

 async.progress(function(err, progress, data){
   if(err)
     console.log(err);
   console.log(data);
 });

 async.done(function(result){
    console.log(result);
 });

 async.fail(function(err){
   console.log(err);
 })

```

##License
MIT
