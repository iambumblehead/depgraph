// Filename: depgraph_edge.js  
// Timestamp: 2018.03.29-05:44:21 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  

import immutable from 'immutable';

const get = (refname, uid) => immutable.Map({
  refname : refname,
  uid     : uid
});
  
const issame = (edgea, edgeb) => (
  immutable.is(edgea, edgeb));

const issamenot = (edgea, edgeb) => (
  !issame(edgea, edgeb));

export default {
  get,
  issame,
  issamenot
}
