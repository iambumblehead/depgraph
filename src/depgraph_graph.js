// Filename: depgraph_graph.js  
// Timestamp: 2018.03.29-05:44:05 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

import immutable from 'immutable'
import depgraph_node from './depgraph_node.js'

const get = () => immutable.Map({});

const setnode = (graph, node, pnode, refname) => {
  var uid = node.get('uid'),
      graph_final = graph.has(uid) ? graph : graph.set(uid, node);    

  if (pnode && refname) {
    if (!graph.has(pnode.get('uid'))) {
      throw new Error('pnode not found');
    }

    return setnodeedge(graph_final, node, pnode, refname);
  }

  return graph_final;
};

const getnode = (graph, node) => (
  graph.get(node.get('uid')));

// returns first vnode with 'in' degree of 0
const getnoderoot = graph => (
  graph.find((val, key) => val.get('inarr').count() === 0));

// why parent node and child node...
const setnodeedge = (graph, cnode, pnode, refname) => {
  var graph_cnode = getnode(graph, cnode),
      graph_pnode = getnode(graph, pnode);
  
  return graph
    .set(cnode.get('uid'),
         depgraph_node.setedgein(
           graph_cnode, pnode.get('uid'), refname))
    .set(pnode.get('uid'),
         depgraph_node.setedgeout(
           graph_pnode, cnode.get('uid'), refname));
};

// recursively walk dependencies of the module at filepath
//
// for each node,
//   if not represented in the graph
//     continue using new graph with added node/pnode relationship
//   else
//     return graph
//
const getfromseedfile = async (filepath, opts) => {
  return depgraph_node.walkbeginfile(
    filepath,
    opts,
    get(), // empty new graph to start
    function iswalkcontinuefn (graph, node, pnode) {
      return !graph.has(node.get('uid'));
    },
    function accumfn(graph, node, pnode, refname) {
      return setnode(graph, node, pnode, refname);
    })
};

const getdeparr = (graph, opts, node, narr, parr) => {
  node  = node || getnoderoot(graph);
  opts = opts || {},
  narr = narr || [], // node arr
  parr = parr || []; // parent arr

  if (node) {      
    if (!narr.some(elem => elem.get('uid') === node.get('uid'))
        && !parr.some(pnode => {
          if (pnode.get('uid') === node.get('uid')) {
            if (opts.iscircular === false) {
              throw new Error('[!!!] circular dependency: :pnode <=> :cnode'
                              .replace(/:pnode/, pnode.get('uid'))
                              .replace(/:cnode/, parr[0].get('uid')));
            }
            return true;
          }
        })
       ) {
      parr.unshift(node);
      
      node.get('outarr').map(edge => {
        narr = getdeparr(graph, opts, graph.get(edge.get('uid')), narr, parr);
      });
      narr.push(node);
    }
  }
  
  return narr;
};

export default {
  get,
  setnode,
  getnode,
  getnoderoot,
  setnodeedge,
  getdeparr,
  getfromseedfile
}
