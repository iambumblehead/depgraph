import test from 'node:test'
import assert from 'node:assert/strict'
import depgraph from '../src/depgraph.js'

test("should have accessible namespaces for graph, tree, node and edge", () => {
  [ 'graph', 'node', 'edge', 'tree' ]
    .map(name => assert.ok(name in depgraph))
})


