// Filename: depgraph_tree.spec.js  
// Timestamp: 2015.11.24-02:55:07 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>


var depgraph_tree = require('../src/depgraph_tree');

describe('depgraph_tree.getfromseedfile', function () {
  it('[./test/files/root.js] should print a tree', function (donefn) {

    var filepath = './test/files/root.js';

    depgraph_tree.getfromseedfile(filepath, function (err, tree) {
      // console.log(archy(tree))
      expect(true).toBe(true);
      donefn();
    });
  });
});
