// Filename: testrun.js  
// Timestamp: 2015.12.15-07:31:44 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  

import depgraph from '../../src/depgraph.js'
import archy from 'archy'

depgraph.graph.getfromseedfile('./test/files/root.js', {}, function (err, graph) {
  console.log(JSON.stringify(graph, null, '\t'));
  console.log('\n');

  depgraph.graph.getfromseedfile('./test/files/root.js', {}, function (err, graph) {
    console.log(JSON.stringify(depgraph.graph.getdeparr(graph), null, '\t'));
    console.log('\n');

    depgraph.tree.getfromseedfile('./test/files/root.js', {}, function (err, tree) {
      console.log(archy(tree));
      console.log('\n');      
      
      depgraph.tree.getfromseedfilesmall('./test/files/root.js', {}, function (err, tree) {
        console.log(archy(tree));
        console.log('\n');              

        depgraph.tree.getfromseedfilesmall('./test/files/root.js', { browser: true }, function (err, tree) {
          console.log(archy(tree));

        });        
      });
    });
  });
});

