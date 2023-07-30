// Filename: depgraph_graph.spec.js  
// Timestamp: 2015.11.24-16:19:05 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

import test from 'node:test'
import assert from 'node:assert/strict'
import depgraph_graph from '../src/depgraph_graph.js'
import depgraph_node from '../src/depgraph_node.js'
import immutable from 'immutable'

test("should return an empty object", () => {

  var graph = depgraph_graph.get();
  
  assert.true(typeof graph === 'object')
});

test("should add the given node to the given graph", () => {
  var node = depgraph_node.get(
    'test_filepath',
    'test_content'
  );
  
  var graph = depgraph_graph.get();
  
  var graphfin = depgraph_graph.setnode(graph, node);

  assert.true(
    immutable.is(graphfin.get(node.get('uid')), node)
  );
});

test("should add the given node to the given graph, with edge to existing pnode", () => {
  var node = depgraph_node.get(
    'test_filepath',
    'test_content'
  );
  var pnode = depgraph_node.get(
    'parent_filepath',
    'parent_content'
  );
  
  var graph = depgraph_graph.setnode(depgraph_graph.get(), pnode);
  var graphfin = depgraph_graph.setnode(graph, node, pnode, './parent');

  assert.true(
    graphfin.get(node.get('uid')).get('filepath') === node.get('filepath') &&
      graphfin.get(node.get('uid')).get('inarr').get(0).get('refname') === './parent' &&
      graphfin.get(pnode.get('uid')).get('outarr').get(0).get('refname') === './parent'      
  );
});

test("should throw error if existing pnode not found in graph", async () => {
  var node = depgraph_node.get(
    'test_filepath',
    'test_content'
  );
  var pnode = depgraph_node.get(
    'parent_filepath',
    'parent_content'
  );
  
  var graph = depgraph_graph.get();

  await assert.rejects(async () => {
    depgraph_graph.setnode(graph, node, pnode, './parent');
  }).toThrow({
    message: 'pnode not found'
  });
});

test('[./spec/files/root.js] should return a graph with nine nodes', donefn => {

  var filepath = './spec/files/root.js';

  depgraph_graph.getfromseedfile(filepath, {}, (err, graph) => {
    var arr = depgraph_graph.getdeparr(graph);

    assert.strictEqual(arr.length, 8);
  });
});

/*
describe('depgraph_graph.getdeparr', () => {
test('[./spec/files/root.js] should return nodes in the correct order', donefn => {

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
