// full tree construction is impossible when circular references exist, the tree
// printed by this file provides visual-feedback for interactive development

import depgraph_graph from './depgraph_graph.js'
import archy from 'archy'

// compatible with substack's 'archy', which also uses label/nodes:
//
// console.log(archy({
//   label : 'label',
//   nodes : [...]
// }));
//
const get = (label, nodes) => ({
  label,
  nodes : nodes || []
});


// full tree impossible when circular reference
//
const getfromgraph = (graph, gnode, uidarr) => {
  gnode  = gnode || depgraph_graph.getnoderoot(graph);
  uidarr = uidarr || [];

  return gnode && get(
    gnode.get('uid'),
    gnode.get('outarr').map(node => {
      var nodeuid = node.get('uid');

      if (~uidarr.indexOf(nodeuid)) {
        return get(nodeuid);
      } else {
        uidarr.push(nodeuid);
        return getfromgraph(graph, graph.get(nodeuid), uidarr);
      };
    }).toJS());
};

const getfromgraphsmall = graph => (
  filtered(getfromgraph(graph), []))

const getfromseedfile = async (filepath, opts) => {
  const graph = await depgraph_graph.getfromseedfile(filepath, opts)

  return getfromgraph(graph)
};

const getfromseedfilesmall = async (filepath, opts) => {
  const graph = await depgraph_graph.getfromseedfile(filepath, opts)

  return getfromgraphsmall(graph)
};

const filtered = (tree, arr) => {
  if (arr.indexOf(tree.label) === -1) {
    arr.push(tree.label);
    return get(
      tree.label,
      tree.nodes.map(node => {
        return filtered(node, arr);
      }).filter(function (n) {
        return n !== undefined;
      })
    );
  }
};

export default {
  get,
  getfromgraph,

  getfromgraphsmall,
  getfromseedfile,
  getfromseedfilesmall,
  filtered
}
