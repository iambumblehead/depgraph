// Filename: depgraph_node.spec.js  
// Timestamp: 2015.11.24-01:56:18 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  

import test from 'node:test'
import assert from 'node:assert/strict'
import depgraph_node from '../src/depgraph_node.js'

test("should return a node with given filepath and content", () => {
  var node = depgraph_node.get(
    'test_filepath',
    'test_content'
  );

  assert.true(
    node.get('filepath') === 'test_filepath' &&
      node.get('content') === 'test_content'
  );
});
