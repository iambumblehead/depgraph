// Filename: depgraph_edge.js  
// Timestamp: 2015.11.24-00:14:28 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  

var immutable = require('immutable');

var depgraph_edge = module.exports = (function (o) {

  o.get = function (refname, uid) {
    return immutable.Map({
      refname : refname,
      uid     : uid
    });
  };
  
  o.issame = function (edgea, edgeb) {
    return immutable.is(edgea, edgeb);
  };

  o.issamenot = function (edgea, edgeb) {
    return !o.issame(edgea, edgeb);
  };
  
  return o;
  
}({}));
