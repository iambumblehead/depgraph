// Filename: depgraph_graph.spec.js  
// Timestamp: 2015.11.24-16:19:05 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

var depgraph_graph = require('../src/depgraph_graph'),
    depgraph_node = require('../src/depgraph_node'),
    immutable = require('immutable');

describe("depgraph_graph.get()", function () {
  it("should return an empty object", function () {

    var graph = depgraph_graph.get();
    
    expect(
      typeof graph === 'object'
    ).toBe( true );
  });
});

describe("depgraph_graph.setnode( graph, node )", function () {
  it("should add the given node to the given graph", function () {
    var node = depgraph_node.get(
      'test_filepath',
      'test_content'
    );
    
    var graph = depgraph_graph.get();
    
    var graphfin = depgraph_graph.setnode(graph, node);

    expect(
      immutable.is(graphfin.get(node.get('uid')), node)
    ).toBe( true );
  });
});

describe("depgraph_graph.setnode( graph, node, pnode, refname )", function () {

  it("should add the given node to the given graph, with edge to existing pnode", function () {
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

    expect(
      graphfin.get(node.get('uid')).get('filepath') === node.get('filepath') &&
        graphfin.get(node.get('uid')).get('inarr').get(0).get('refname') === './parent' &&
        graphfin.get(pnode.get('uid')).get('outarr').get(0).get('refname') === './parent'      
    ).toBe( true );
  });

  it("should throw error if existing pnode not found in graph", function () {
    var node = depgraph_node.get(
      'test_filepath',
      'test_content'
    );
    var pnode = depgraph_node.get(
      'parent_filepath',
      'parent_content'
    );
    
    var graph = depgraph_graph.get();

    expect(function () {
      depgraph_graph.setnode(graph, node, pnode, './parent');
    }).toThrow(new Error('pnode not found'));

  });
  
});

describe('depgraph_graph.getdeparr', function () {
  it('[./test/files/root.js] should return a graph with nine nodes', function (donefn) {

    var filepath = './test/files/root.js';

    depgraph_graph.getfromseedfile(filepath, function (err, graph) {
      var arr = depgraph_graph.getdeparr(graph);

      expect(arr.length).toBe(9);
      donefn();
    });
  });
});

describe('depgraph_graph.getdeparr', function () {
  it('[./test/files/root.js] should return nodes in the correct order', function (donefn) {

    var filepath = './test/files/root.js';

    depgraph_graph.getfromseedfile(filepath, function (err, graph) {
      var arr = depgraph_graph.getdeparr(graph);

      ['depgraph-0.0.1:~/test/files/root.js',
       'depgraph-0.0.1:~/test/files/fileb.js',
       'depgraph-0.0.1:~/test/files/filea.js',
       'depgraph-0.0.1:~/test/files/fileb.js',
       'depgraph-0.0.1:~/test/files/filec/index.js',
       'resolveuid-0.0.2:~/index.js',
       'resolveuid-0.0.2:~/src/resolveuid.js',
       'depgraph-0.0.1:~/test/files/dir/filed.js',
       'depgraph-0.0.1:~/test/files/filec/index.js'
      ].map(function (uid, i) {
        expect( arr[i].get('uid') ).toBe( uid );
      });

      donefn();
    });    
  });
});

