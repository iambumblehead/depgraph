// Filename: depgraph_graph.spec.js  
// Timestamp: 2015.11.24-16:19:05 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

import test from 'node:test'
import assert from 'node:assert/strict'
import depgraph_graph from '../src/depgraph_graph.js'
import depgraph_node from '../src/depgraph_node.js'
import immutable from 'immutable'

test("should return an empty object", () => {
  const graph = depgraph_graph.get()
  
  assert.strictEqual(typeof graph, 'object')
})

test("should add the given node to the given graph", () => {
  const graph = depgraph_graph.get()
  const node = depgraph_node.get(
    'test_filepath',
    'test_content'
  )
  
  const graphfin = depgraph_graph.setnode(graph, node)

  assert.ok(
    immutable.is(graphfin.get(node.get('uid')), node)
  )
})

test("should add the node to graph, with edge to existing pnode", () => {
  const node = depgraph_node.get(
    'test_filepath',
    'test_content')
  const pnode = depgraph_node.get(
    'parent_filepath',
    'parent_content')
  const parent = './parent'
  const graph = depgraph_graph.setnode(depgraph_graph.get(), pnode)
  const graphfin = depgraph_graph.setnode(graph, node, pnode, './parent')

  const graphnode = graphfin.get(node.get('uid'))
  const graphpnode = graphfin.get(pnode.get('uid'))

  assert.ok(
    graphnode.get('filepath') === node.get('filepath')
      && graphnode.get('inarr').get(0).get('refname') === parent
      && graphpnode.get('outarr').get(0).get('refname') === parent)
})

test("should throw error if existing pnode not found in graph", async () => {
  const graph = depgraph_graph.get()
  const node = depgraph_node.get(
    'test_filepath',
    'test_content')
  const pnode = depgraph_node.get(
    'parent_filepath',
    'parent_content')

  await assert.rejects(async () => {
    depgraph_graph.setnode(graph, node, pnode, './parent')
  }, {
    message: 'pnode not found'
  })
})

test('[./spec/files/root.js] should return graph with nine nodes', async () => {
  const filepath = './spec/files/root.js'
  const graph = await depgraph_graph.getfromseedfile(filepath, {})
  const arr = depgraph_graph.getdeparr(graph)

  assert.strictEqual(arr.length, 7)
})

/*
describe('depgraph_graph.getdeparr', () => {
test('[./spec/files/root.js] should return nodes in correct order', donefn => {

    var filepath = './spec/files/root.js';

    depgraph_graph.getfromseedfile(filepath, {}, (err, graph) => {
        var arr = depgraph_graph.getdeparr(graph);
        var uidarr = arr.map( a => a.get('uid') );

        
      ['depgraph-0.3.8:~/spec/files/root.js',
       'depgraph-0.3.8:~/spec/files/fileb.js',
       'depgraph-0.3.8:~/spec/files/filea.js',
       'depgraph-0.3.8:~/spec/files/fileb.js',
       'depgraph-0.3.8:~/spec/files/filec/index.js',
       'resolveuid-0.0.3:~/index.js',
       'resolveuid-0.0.3:~/src/resolveuid.js'
       // 'depgraph-0.3.8:~/spec/files/dir/filed.js',
       // 'depgraph-0.3.8:~/spec/files/filec/index.js'
      ].map( ( uid, i ) => {
          console.log('uuid', uidarr[i], uid );
          expect( uid ).toBe( uidarr[i] );
      });

      donefn();
    });    
  });
});
*/
