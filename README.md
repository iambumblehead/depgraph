depgraph
========

[![npm][9]][7] [![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)][6]


![scrounge](https://github.com/iambumblehead/scroungejs/raw/main/img/hand3.png)

depgraph returns a dependency graph for a javascript module. It resolves ESM, CommonJS and Typescript modules using [resolvewithplus][3].

depgraph is similar to [module-deps][2] and uses some of the same dependencies.


[0]: http://www.bumblehead.com                          "bumblehead"
[1]: http://facebook.github.io/immutable-js           "immutable-js"
[2]: https://github.com/substack/module-deps           "module-deps"
[3]: https://github.com/iambumblehead/resolvewithplus/blob/main/src/resolvewithplus.js "resolvewith"
[4]: https://github.com/substack/node-archy#example     "archy tree"
[5]: https://github.com/substack/browserify-handbook#browser-field
[6]: https://www.gnu.org/licenses/gpl-3.0
[7]: https://www.npmjs.com/package/depgraph
[9]: https://img.shields.io/npm/v/depgraph


---------------------------------------------------------

A sample graph, tree and dependency-ordered array are seen using example calls below found in the unit tests.

## Graph

For each graph node, "inarr" references dependent nodes and "outarr" references depedency nodes.

```javascript
const graph = await depgraph.graph.getfromseedfile('./test/files/root.js')

console.log(JSON.stringify(graph, null, '\t'))
```

_result_
```json
{
  "depgraph-0.0.6:~/test/files/root.js": {
    "content": "...",
    "filepath": "./test/files/root.js",
    "uid": "depgraph-0.0.6:~/test/files/root.js",
    "inarr": [],
    "outarr": [{
      "refname": "./fileb",
      "uid": "depgraph-0.0.6:~/test/files/fileb.js"
    },{
      "refname": "./filea",
      "uid": "depgraph-0.0.6:~/test/files/filea.js"
    },{
      "refname": "./filec",
      "uid": "depgraph-0.0.6:~/test/files/filec/index.js"
    },{
      "refname": "resolveuid",
      "uid": "resolveuid-0.0.2:~/index.js"
    },{
      "refname": "./dir/filed.js",
      "uid": "depgraph-0.0.6:~/test/files/dir/filed.js"
    }]
  },
  "depgraph-0.0.6:~/test/files/fileb.js": {
    "content": "...",
    "filepath": "./test/files/fileb.js",
    "uid": "depgraph-0.0.6:~/test/files/fileb.js",
    "inarr": [{
      "refname": "./fileb",
      "uid": "depgraph-0.0.6:~/test/files/root.js"
    },{
      "refname": "./fileb",
      "uid": "depgraph-0.0.6:~/test/files/filea.js"
    }],
    "outarr": []
  },
  "depgraph-0.0.6:~/test/files/filea.js": {
    "content": "...",
    "filepath": "./test/files/filea.js",
    "uid": "depgraph-0.0.6:~/test/files/filea.js",
    "inarr": [{
      "refname": "./filea",
      "uid": "depgraph-0.0.6:~/test/files/root.js"
    }],
    "outarr": [{
      "refname": "./fileb",
      "uid": "depgraph-0.0.6:~/test/files/fileb.js"
    }]
  },
  "depgraph-0.0.6:~/test/files/filec/index.js": {
    "content": "...",
    "filepath": "./test/files/filec/index.js",
    "uid": "depgraph-0.0.6:~/test/files/filec/index.js",
    "inarr": [{
      "refname": "./filec",
      "uid": "depgraph-0.0.6:~/test/files/root.js"
    },{
      "refname": "./../filec",
      "uid": "depgraph-0.0.6:~/test/files/dir/filed.js"
    }],
    "outarr": []
  },
  "resolveuid-0.0.2:~/index.js": {
    "content": "...",
    "filepath": "./node_modules/resolveuid/index.js",
    "uid": "resolveuid-0.0.2:~/index.js",
    "inarr": [{
      "refname": "resolveuid",
      "uid": "depgraph-0.0.6:~/test/files/root.js"
    }],
    "outarr": [{
      "refname": "./src/resolveuid",
      "uid": "resolveuid-0.0.2:~/src/resolveuid.js"
    }]
  },
  "resolveuid-0.0.2:~/src/resolveuid.js": {
    "content": "...",
    "filepath": "./node_modules/resolveuid/src/resolveuid.js",
    "uid": "resolveuid-0.0.2:~/src/resolveuid.js",
    "inarr": [{
      "refname": "./src/resolveuid",
      "uid": "resolveuid-0.0.2:~/index.js"
    }],
    "outarr": []
  },
  "depgraph-0.0.6:~/test/files/dir/filed.js": {
    "content": "...",
    "filepath": "./test/files/dir/filed.js",
    "uid": "depgraph-0.0.6:~/test/files/dir/filed.js",
    "inarr": [{
      "refname": "./dir/filed.js",
      "uid": "depgraph-0.0.6:~/test/files/root.js"
    }],
    "outarr": [{
      "refname": "./../filec",
      "uid": "depgraph-0.0.6:~/test/files/filec/index.js"
    }]
  }
}
```

## Array

The graph is used to construct a dependency-ordered array.

```javascript
const graph = await depgraph.graph.getfromseedfile('./test/files/root.js')

console.log(JSON.stringify(depgraph.graph.getdeparr(graph), null, '\t'))
```

_result_
```json
[{
  "content": "...",
  "filepath": "./test/files/fileb.js",
  "uid": "depgraph-0.0.6:~/test/files/fileb.js",
  "inarr": [{
    "refname": "./fileb",
    "uid": "depgraph-0.0.6:~/test/files/root.js"
  },{
    "refname": "./fileb",
    "uid": "depgraph-0.0.6:~/test/files/filea.js"
  }],
  "outarr": []
},{
  "content": "...",
  "filepath": "./test/files/filea.js",
  "uid": "depgraph-0.0.6:~/test/files/filea.js",
  "inarr": [{
    "refname": "./filea",
    "uid": "depgraph-0.0.6:~/test/files/root.js"
  }],
  "outarr": [{
    "refname": "./fileb",
    "uid": "depgraph-0.0.6:~/test/files/fileb.js"
  }]
},{
  "content": "...",
  "filepath": "./test/files/filec/index.js",
  "uid": "depgraph-0.0.6:~/test/files/filec/index.js",
  "inarr": [{
    "refname": "./filec",
    "uid": "depgraph-0.0.6:~/test/files/root.js"
  },{
    "refname": "./../filec",
    "uid": "depgraph-0.0.6:~/test/files/dir/filed.js"
  }],
  "outarr": []
},{
  "content": "...",
  "filepath": "./node_modules/resolveuid/src/resolveuid.js",
  "uid": "resolveuid-0.0.2:~/src/resolveuid.js",
  "inarr": [{
    "refname": "./src/resolveuid",
    "uid": "resolveuid-0.0.2:~/index.js"
  }],
  "outarr": []
},{
  "content": "...",
  "filepath": "./node_modules/resolveuid/index.js",
  "uid": "resolveuid-0.0.2:~/index.js",
  "inarr": [{
    "refname": "resolveuid",
    "uid": "depgraph-0.0.6:~/test/files/root.js"
  }],
  "outarr": [{
    "refname": "./src/resolveuid",
    "uid": "resolveuid-0.0.2:~/src/resolveuid.js"
  }]
},{
  "content": "...",
  "filepath": "./test/files/dir/filed.js",
  "uid": "depgraph-0.0.6:~/test/files/dir/filed.js",
  "inarr": [{
    "refname": "./dir/filed.js",
	"uid": "depgraph-0.0.6:~/test/files/root.js"
  }],
  "outarr": [{
    "refname": "./../filec",
    "uid": "depgraph-0.0.6:~/test/files/filec/index.js"
  }]
},{
  "content": "...",
  "filepath": "./test/files/root.js",
  "uid": "depgraph-0.0.6:~/test/files/root.js",
  "inarr": [],
  "outarr": [{
    "refname": "./fileb",
    "uid": "depgraph-0.0.6:~/test/files/fileb.js"
  },{
    "refname": "./filea",
    "uid": "depgraph-0.0.6:~/test/files/filea.js"
  },{
    "refname": "./filec",
    "uid": "depgraph-0.0.6:~/test/files/filec/index.js"
  },{
    "refname": "resolveuid",
    "uid": "resolveuid-0.0.2:~/index.js"
  },{
    "refname": "./dir/filed.js",
    "uid": "depgraph-0.0.6:~/test/files/dir/filed.js"
  }]
}]
```

# Tree

Trees are generated from the graph usi the [archy format][4]. Full tree construction may be prohibited by circular cjs dependencies.

The default tree may render a leaf multiple times, but will render the children once only.

```javascript
const tree = await depgraph.tree.getfromseedfile('./test/files/root.js')

console.log(archy(tree));
```

_result_
```bash
depgraph-0.0.6:~/test/files/root.js
├── depgraph-0.0.6:~/test/files/fileb.js
├─┬ depgraph-0.0.6:~/test/files/filea.js
│ └── depgraph-0.0.6:~/test/files/fileb.js
├── depgraph-0.0.6:~/test/files/filec/index.js
├─┬ resolveuid-0.0.2:~/index.js
│ └── resolveuid-0.0.2:~/src/resolveuid.js
└─┬ depgraph-0.0.6:~/test/files/dir/filed.js
  └── depgraph-0.0.6:~/test/files/filec/index.js
```

The 'small' tree renders each leaf once only.

```javascript
const tree = await depgraph.tree.getfromseedfilesmall('./test/files/root.js')

console.log(archy(tree))
```

_result_
```bash
depgraph-0.0.6:~/test/files/root.js
├── depgraph-0.0.6:~/test/files/fileb.js
├── depgraph-0.0.6:~/test/files/filea.js
├── depgraph-0.0.6:~/test/files/filec/index.js
├─┬ resolveuid-0.0.2:~/index.js
│ └── resolveuid-0.0.2:~/src/resolveuid.js
└── depgraph-0.0.6:~/test/files/dir/filed.js
```

# Modifiers

When `{ iscircular: false }` is passed to `getdeparr` an error will be thrown when circular dependencies are found. All options are passed directly to the resolver, [resolvewithplus,][3] and so it is possible to specify preferred resolutions using options like `{ isbrowser: true }` and `{ priority: ['browser', 'import', ':spectype', 'default'] }`


 ![scrounge](https://github.com/iambumblehead/scroungejs/raw/main/img/hand.png) 
