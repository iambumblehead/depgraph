// Filename: testrun.js  
// Timestamp: 2015.12.15-07:31:44 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  

import depgraph from '../../src/depgraph.js'
import archy from 'archy'

depgraph.graph.getfromseedfile('./spec/files/root.js', {}, (err, graph) => {
  if (err) throw new Error(err)
  console.log(JSON.stringify(graph, null, '  '));
  console.log('\n');

  depgraph.graph.getfromseedfile('./spec/files/root.js', {}, (err, graph) => {
    if (err) throw new Error(err)
    console.log(JSON.stringify(depgraph.graph.getdeparr(graph), null, '  '));
    console.log('\n');

    depgraph.tree.getfromseedfile('./spec/files/root.js', {}, (err, tree) => {
      if (err) throw new Error(err)
      console.log(archy(tree));
      console.log('\n');      
      
      depgraph.tree.getfromseedfilesmall('./spec/files/root.js', {}, (err, tree) => {
        if (err) throw new Error(err)
        console.log(archy(tree));
        console.log('\n');              

        depgraph.tree.getfromseedfilesmall('./spec/files/root.js', { browser: true }, (err, tree) => {
          if (err) throw new Error(err)

          console.log(archy(tree));
        });        
      });
    });
  });
});

