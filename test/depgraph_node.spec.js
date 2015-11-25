// Filename: depgraph_node.spec.js  
// Timestamp: 2015.11.24-01:56:18 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  

var depgraph_node = require('../src/depgraph_node');

describe("depgraph_node.get( filepath, content )", function () {
  it("should return a node with given filepath and content", function () {

    var node = depgraph_node.get(
      'test_filepath',
      'test_content'
    );

    expect(
      node.get('filepath') === 'test_filepath' &&
        node.get('content') === 'test_content'
    ).toBe( true );
  });
});
