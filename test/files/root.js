// Timestamp: 2015.11.23-22:01:39 (last modified)

var fileb = require('./fileb'),
    filea = require('./filea'),
    filec = require('./filec'),
    resolveuid = require('resolveuid'),    
    filed = require('./dir/filed.js');

var root = module.exports = {
  name : 'root',
  filea : filea,
  fileb : fileb,
  filec : filec,
  filed : filed  
};
