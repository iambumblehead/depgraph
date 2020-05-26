// Filename: depgraph_tree.spec.js  
// Timestamp: 2015.11.24-02:55:07 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>


var depgraph_tree = require('../src/depgraph_tree');

describe('depgraph_tree.getfromseedfile', () => {
  it('[./test/files/root.js] should print a tree', donefn => {

    var filepath = './spec/files/root.js';

      depgraph_tree.getfromseedfile(filepath, {}, (err, tree) => {
      // console.log(archy(tree))
      expect(true).toBe(true);
      donefn();
    });
  });
});
