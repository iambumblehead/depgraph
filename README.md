depgraph
========
**(c)[Bumblehead][0]** [MIT-license](#license)
![scrounge](https://github.com/iambumblehead/scroungejs/raw/master/img/hand3.png)

depgraph returns a dependency graph for a javascript module. It resolves ES6 modules, CommonJS modules and Typescript files using [resolvewithplus][3].

depgraph is similar to [module-deps][2], a popular package by Substack and it uses some of the same dependencies as module-deps.


[0]: http://www.bumblehead.com                          "bumblehead"
[1]: http://facebook.github.io/immutable-js           "immutable-js"
[2]: https://github.com/substack/module-deps           "module-deps"
[3]: https://github.com/iambumblehead/resolvewithplus/blob/master/src/resolvewithplus.js "resolvewith"
[4]: https://github.com/substack/node-archy#example     "archy tree"
[5]: https://github.com/substack/browserify-handbook#browser-field

---------------------------------------------------------

A sample graph, tree and dependency-ordered array are seen using example calls below found in the unit tests.

## Graph

For each graph node, "inarr" references dependent nodes and "outarr" references depedency nodes.

```javascript
depgraph.graph.getfromseedfile('./test/files/root.js', {}, function (err, graph) {
  console.log(JSON.stringify(graph, null, '\t'));
});
```

_result_
```json
{
  "depgraph-0.0.6:~/test/files/root.js": {
    "content": "...",
    "filepath": "./test/files/root.js",
    "uid": "depgraph-0.0.6:~/test/files/root.js",
    "inarr": [],
    "outarr": [
      {
	"refname": "./fileb",
	"uid": "depgraph-0.0.6:~/test/files/fileb.js"
      },
      {
	"refname": "./filea",
	"uid": "depgraph-0.0.6:~/test/files/filea.js"
      },
      {
	"refname": "./filec",
	"uid": "depgraph-0.0.6:~/test/files/filec/index.js"
      },
      {
	"refname": "resolveuid",
	"uid": "resolveuid-0.0.2:~/index.js"
      },
      {
	"refname": "./dir/filed.js",
	"uid": "depgraph-0.0.6:~/test/files/dir/filed.js"
      }
    ]
  },
  "depgraph-0.0.6:~/test/files/fileb.js": {
    "content": "...",
    "filepath": "./test/files/fileb.js",
    "uid": "depgraph-0.0.6:~/test/files/fileb.js",
    "inarr": [
      {
	"refname": "./fileb",
	"uid": "depgraph-0.0.6:~/test/files/root.js"
      },
      {
	"refname": "./fileb",
	"uid": "depgraph-0.0.6:~/test/files/filea.js"
      }
    ],
    "outarr": []
  },
  "depgraph-0.0.6:~/test/files/filea.js": {
    "content": "...",
    "filepath": "./test/files/filea.js",
    "uid": "depgraph-0.0.6:~/test/files/filea.js",
    "inarr": [
      {
	"refname": "./filea",
	"uid": "depgraph-0.0.6:~/test/files/root.js"
      }
    ],
    "outarr": [
      {
	"refname": "./fileb",
	"uid": "depgraph-0.0.6:~/test/files/fileb.js"
      }
    ]
  },
  "depgraph-0.0.6:~/test/files/filec/index.js": {
    "content": "...",
    "filepath": "./test/files/filec/index.js",
    "uid": "depgraph-0.0.6:~/test/files/filec/index.js",
    "inarr": [
      {
	"refname": "./filec",
	"uid": "depgraph-0.0.6:~/test/files/root.js"
      },
      {
	"refname": "./../filec",
	"uid": "depgraph-0.0.6:~/test/files/dir/filed.js"
      }
    ],
    "outarr": []
  },
  "resolveuid-0.0.2:~/index.js": {
    "content": "...",
    "filepath": "./node_modules/resolveuid/index.js",
    "uid": "resolveuid-0.0.2:~/index.js",
    "inarr": [
      {
	"refname": "resolveuid",
	"uid": "depgraph-0.0.6:~/test/files/root.js"
      }
    ],
    "outarr": [
      {
	"refname": "./src/resolveuid",
	"uid": "resolveuid-0.0.2:~/src/resolveuid.js"
      }
    ]
  },
  "resolveuid-0.0.2:~/src/resolveuid.js": {
    "content": "...",
    "filepath": "./node_modules/resolveuid/src/resolveuid.js",
    "uid": "resolveuid-0.0.2:~/src/resolveuid.js",
    "inarr": [
      {
	"refname": "./src/resolveuid",
	"uid": "resolveuid-0.0.2:~/index.js"
      }
    ],
    "outarr": []
  },
  "depgraph-0.0.6:~/test/files/dir/filed.js": {
    "content": "...",
    "filepath": "./test/files/dir/filed.js",
    "uid": "depgraph-0.0.6:~/test/files/dir/filed.js",
    "inarr": [
      {
	"refname": "./dir/filed.js",
	"uid": "depgraph-0.0.6:~/test/files/root.js"
      }
    ],
    "outarr": [
      {
	"refname": "./../filec",
	"uid": "depgraph-0.0.6:~/test/files/filec/index.js"
      }
    ]
  }
}
```

## Array

The graph is used to construct a dependency-ordered array.

```javascript
depgraph.graph.getfromseedfile('./test/files/root.js', function (err, graph) {
  console.log(JSON.stringify(depgraph.graph.getdeparr(graph), null, '\t'));
});
```

_result_
```json
[
  {
    "content": "...",
    "filepath": "./test/files/fileb.js",
    "uid": "depgraph-0.0.6:~/test/files/fileb.js",
    "inarr": [
      {
	"refname": "./fileb",
	"uid": "depgraph-0.0.6:~/test/files/root.js"
      },
      {
	"refname": "./fileb",
	"uid": "depgraph-0.0.6:~/test/files/filea.js"
      }
    ],
    "outarr": []
  },
  {
    "content": "...",
    "filepath": "./test/files/filea.js",
    "uid": "depgraph-0.0.6:~/test/files/filea.js",
    "inarr": [
      {
	"refname": "./filea",
	"uid": "depgraph-0.0.6:~/test/files/root.js"
      }
    ],
    "outarr": [
      {
	"refname": "./fileb",
	"uid": "depgraph-0.0.6:~/test/files/fileb.js"
      }
    ]
  },
  {
    "content": "...",
    "filepath": "./test/files/filec/index.js",
    "uid": "depgraph-0.0.6:~/test/files/filec/index.js",
    "inarr": [
      {
	"refname": "./filec",
	"uid": "depgraph-0.0.6:~/test/files/root.js"
      },
      {
	"refname": "./../filec",
	"uid": "depgraph-0.0.6:~/test/files/dir/filed.js"
      }
    ],
    "outarr": []
  },
  {
    "content": "...",
    "filepath": "./node_modules/resolveuid/src/resolveuid.js",
    "uid": "resolveuid-0.0.2:~/src/resolveuid.js",
    "inarr": [
      {
	"refname": "./src/resolveuid",
	"uid": "resolveuid-0.0.2:~/index.js"
      }
    ],
    "outarr": []
  },
  {
    "content": "...",
    "filepath": "./node_modules/resolveuid/index.js",
    "uid": "resolveuid-0.0.2:~/index.js",
    "inarr": [
      {
	"refname": "resolveuid",
	"uid": "depgraph-0.0.6:~/test/files/root.js"
      }
    ],
    "outarr": [
      {
	"refname": "./src/resolveuid",
	"uid": "resolveuid-0.0.2:~/src/resolveuid.js"
      }
    ]
  },
  {
    "content": "...",
    "filepath": "./test/files/dir/filed.js",
    "uid": "depgraph-0.0.6:~/test/files/dir/filed.js",
    "inarr": [
      {
	"refname": "./dir/filed.js",
	"uid": "depgraph-0.0.6:~/test/files/root.js"
      }
    ],
    "outarr": [
      {
	"refname": "./../filec",
	"uid": "depgraph-0.0.6:~/test/files/filec/index.js"
      }
    ]
  },
  {
    "content": "...",
    "filepath": "./test/files/root.js",
    "uid": "depgraph-0.0.6:~/test/files/root.js",
    "inarr": [],
    "outarr": [
      {
	"refname": "./fileb",
	"uid": "depgraph-0.0.6:~/test/files/fileb.js"
      },
      {
	"refname": "./filea",
	"uid": "depgraph-0.0.6:~/test/files/filea.js"
      },
      {
	"refname": "./filec",
	"uid": "depgraph-0.0.6:~/test/files/filec/index.js"
      },
      {
	"refname": "resolveuid",
	"uid": "resolveuid-0.0.2:~/index.js"
      },
      {
	"refname": "./dir/filed.js",
	"uid": "depgraph-0.0.6:~/test/files/dir/filed.js"
      }
    ]
  }
]
```

# Tree

The graph is used to generate a tree in the [archy format][4]. Full tree construction is prohibited by circular dependencies so each tree is an incomplete visual aid.

The default tree may render a leaf multiple times, but will render the children once only.

```javascript
depgraph.tree.getfromseedfile('./test/files/root.js', function (err, tree) {
  console.log(archy(tree));
});
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
depgraph.tree.getfromseedfilesmall('./test/files/root.js', {}, function (err, tree) {
  console.log(archy(tree));
});
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

The 'empty' object used in the examples is for configuration. The configuration option, `{ browser : true }` directs depgraph to use the 'browser' rather than 'main' property in a package.json or bower.json file, like [browserify does][5]. When `{ iscircular : false }` is passed to `getdeparr` an error will be thrown for circular dependencies found.


 ![scrounge](https://github.com/iambumblehead/scroungejs/raw/master/img/hand.png) 

(The MIT License)

Copyright (c) [Bumblehead][0] <chris@bumblehead.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
