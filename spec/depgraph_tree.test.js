// Filename: depgraph_tree.spec.js  
// Timestamp: 2015.11.24-02:55:07 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

import test from 'node:test'
import assert from 'node:assert/strict'

import depgraph_tree from '../src/depgraph_tree.js'

test('[./test/files/root.js] should print a tree', async () => {
  const filepath = './spec/files/root.js'
  const tree = await depgraph_tree.getfromseedfile(filepath, {})

  assert.ok(tree)
})
