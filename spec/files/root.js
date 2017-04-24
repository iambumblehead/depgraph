// Timestamp: 2015.12.15-07:30:22 (last modified)

var fileb = require('./fileb'),
    filea = require('./filea'),
    filec = require('./filec'),
    resolveuid = require('resolveuid'),
    bowermodule = require('bowermodule'),        
    filed = require('./dir/filed.js');

var root = module.exports = {
  name : 'root',
  filea : filea,
  fileb : fileb,
  filec : filec,
  filed : filed  
};
