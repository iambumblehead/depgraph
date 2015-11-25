// Filename: depgraph.js  
// Timestamp: 2015.11.24-01:25:08 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  

var depgraph_node = require('./depgraph_node'),
    depgraph_tree = require('./depgraph_tree'),
    depgraph_edge = require('./depgraph_edge'),    
    depgraph_graph = require('./depgraph_graph');

var depgraph = module.exports = {
  node  : depgraph_node,
  tree  : depgraph_tree,
  edge  : depgraph_edge,    
  graph : depgraph_graph
};
