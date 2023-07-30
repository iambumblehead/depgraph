// Filename: depgraph_edge.js  
// Timestamp: 2018.03.29-05:44:21 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  

import immutable from 'immutable';

export default (function (o) {
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
