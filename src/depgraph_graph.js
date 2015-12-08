// Filename: depgraph_graph.js  
// Timestamp: 2015.12.07-20:53:47 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

var immutable = require('immutable'),
    depgraph_node = require('./depgraph_node');

var depgraph_graph = module.exports = (function (o) {
  
  o.get = function (node) {
    return immutable.Map({});
  };

  o.setnode = function (graph, node, pnode, refname) {
    var uid = node.get('uid'),
        graph_final = graph.has(uid) ? graph : graph.set(uid, node);    

    if (pnode && refname) {
      if (!graph.has(pnode.get('uid'))) {
        throw new Error('pnode not found');
      }

      return o.setnodeedge(graph_final, node, pnode, refname);
    }

    return graph_final;
  };

  o.getnode = function (graph, node) {
    return graph.get(node.get('uid'));
  };

  // returns first vnode with 'in' degree of 0
  o.getnoderoot = function (graph) {
    return graph.find(function (val, key) {
      return val.get('inarr').count() === 0;
    });
  };

  // why parent node and child node...
  o.setnodeedge = function (graph, cnode, pnode, refname) {
    var graph_cnode = o.getnode(graph, cnode),
        graph_pnode = o.getnode(graph, pnode);
    
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
  o.getfromseedfile = function (filepath, fn) {
    depgraph_node.walkbeginfile(
      filepath,
      o.get(), // empty new graph to start
      function iswalkcontinuefn (graph, node, pnode) {
        return !graph.has(node.get('uid'));
      },
      function accumfn(graph, node, pnode, refname) {
        return o.setnode(graph, node, pnode, refname);
      }, fn);
  };

  o.getdeparr = function (graph, node, arr) {
    node  = node || o.getnoderoot(graph);
    arr = arr || [];

    if (node) {
      if (!arr.some(function (elem) {
        return elem.get('uid') === node.get('uid');
      })) {
        arr.push(node);
        node.get('outarr').map(function (edge) {
          arr = o.getdeparr(graph, graph.get(edge.get('uid')), arr);
        });
      }
    }
    
    return arr;
  };

  return o;
  
}({}));

