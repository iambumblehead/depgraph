// Filename: depgraph.spec.js  
// Timestamp: 2015.11.24-01:36:43 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  

import test from 'node:test'
import assert from 'node:assert/strict'

import depgraph from '../src/depgraph.js'

test("should have accessible namespaces for graph, tree, node and edge", () => {
  ['graph',
   'node',
   'edge',
   'tree'].map(name => assert.true( name in depgraph ));
});


