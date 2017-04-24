// Filename: depgraph.spec.js  
// Timestamp: 2015.11.24-01:36:43 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  

var depgraph = require('../src/depgraph');

describe("depgraph", function () {
  it("should have accessible namespaces for graph, tree, node and edge", function () {
    ['graph',
     'node',
     'edge',
     'tree'].map(function (name) {
       expect( name in depgraph ).toBe( true );
     });
  });
});

