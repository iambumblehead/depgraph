// Filename: depgraph_tree.js  
// Timestamp: 2018.03.29-05:43:38 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  
//
// full tree construction is impossible when circular references exist, the tree
// printed by this file provides visual-feedback for interactive development

const depgraph_graph = require('./depgraph_graph'),
      archy = require('archy');

module.exports = (function (o) {
  
  // compatible with substack's 'archy', which also uses label/nodes:
  //
  // console.log(archy({
  //   label : 'label',
  //   nodes : [...]
  // }));
  //
  o.get = function (label, nodes) {
    return {
      label : label,
      nodes : nodes || []
    };
  };

  // full tree impossible when circular reference
  //
  o.getfromgraph = function (graph, gnode, uidarr) {
    gnode  = gnode || depgraph_graph.getnoderoot(graph);
    uidarr = uidarr || [];

    return gnode && o.get(
      gnode.get('uid'),
      gnode.get('outarr').map(function (node) {
        var nodeuid = node.get('uid');

        if (~uidarr.indexOf(nodeuid)) {
          return o.get(nodeuid);
        } else {
          uidarr.push(nodeuid);
          return o.getfromgraph(graph, graph.get(nodeuid), uidarr);
        };
      }).toJS());
  };

  o.getfromgraphsmall = function (graph) {
    return o.filtered(o.getfromgraph(graph), []);
  };

  o.getfromseedfile = function (filepath, opts, fn) {
    depgraph_graph.getfromseedfile(filepath, opts, function (err, graph) {
      if (err) return fn(err);

      fn(null, o.getfromgraph(graph));
    });
  };

  o.getfromseedfilesmall = function (filepath, opts, fn) {
    depgraph_graph.getfromseedfile(filepath, opts, function (err, graph) {
      if (err) return fn(err);

      fn(null, o.getfromgraphsmall(graph));
    });    
  };
  
  o.filtered = function (tree, arr) {
    if (arr.indexOf(tree.label) === -1) {
      arr.push(tree.label);
      return o.get(
        tree.label,
        tree.nodes.map(function (node) {
          return o.filtered(node, arr);
        }).filter(function (n) {
          return n !== undefined;
        })
      );
    }
  };

  return o;
  
}({}));
