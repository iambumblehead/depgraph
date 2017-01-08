// Filename: depgraph_node.js  
// Timestamp: 2016.04.14-13:25:28 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

var fs = require('fs'),
    path = require('path'),
    fnguard = require('fnguard'),
    detective = require('detective'),    
    immutable = require('immutable'),
    resolveuid = require('resolveuid'),
    resolvewithplus = require('resolvewithplus'),
    
    depgraph_edge = require('./depgraph_edge');

var depgraph_node = module.exports = (function (o) {

  // 'in'  are dependents
  // 'out' are dependencies
  //
  // nodes with 'in' degree of 0 are tree root nodes
  o.get = function (filepath, filecontent) {
    return immutable.Map({
      content   : filecontent,
      filepath  : filepath,
      uid       : resolveuid(filepath),
      inarr     : immutable.List(),
      outarr    : immutable.List()
    });
  };

  o.get_fromfilepath = function (filepath, fn) {
    fnguard.isstr(filepath).isfn(fn);

    filepath = path.resolve(filepath);
    fs.readFile(filepath, 'utf-8', function (err, filestr) {
      err ? fn(err) : fn(null, o.get(filepath, filestr));
    });      
  };

  o.get_fromfilepathrel = function (filepath, opts, fn) {
    var fullpath = resolvewithplus(filepath, '.' + path.sep, opts);

    if (!fullpath) {
      return fn('dep not found, "' + filepath + '": ' + fullpath);
    }
    
    o.get_fromfilepath(fullpath, fn);
  };

  o.get_arrfromfilepathrel = function (filepatharr, opts, fn) {
    var nodesarr = [];
    
    (function nextdep (filepatharr, x, prepend) {
      if (!x--) return fn(null, nodesarr);

      o.get_fromfilepathrel(filepatharr[x], opts, function (err, res) {
        if (err) return fn(err);

        nodesarr.push(res);
        
        nextdep(filepatharr, x);        
      });
    }(filepatharr, filepatharr.length));
  };

  o.setedge = function (node, uid, refname, edgename) {
    var edge = depgraph_edge.get(refname, uid);

    return node.set(edgename, node.get(edgename).filter(function (inedge) {
      return depgraph_edge.issamenot(edge, inedge);
    }).push(edge));
  };
  
  o.setedgein = function (node, uid, refname) {
    return o.setedge(node, uid, refname, 'inarr');
  };

  o.setedgeout = function (node, uid, refname) {
    return o.setedge(node, uid, refname, 'outarr');
  };

  // walks node childs
  o.walk = function (node, opts, accumstart, onnodefn, oncompletefn, deparr) {
    var nodefilepath = node.get("filepath"),
        depfilepath;
      
    try {
      deparr = deparr || detective(node.get("content"));
    } catch (e) {
      throw new Error('[!!!] error: ' + nodefilepath);
    }

    if (!opts.skipdeparr.some(
      function (skip) { return nodefilepath.indexOf(skip) !== -1; }) &&
        deparr.length && // coremodule ignored
        !resolvewithplus.iscoremodule(deparr[0])) {

      if (!(depfilepath = resolvewithplus(deparr[0], nodefilepath, opts))) {
        return oncompletefn('dep not found, "' + deparr[0] + '": ' + nodefilepath);
      }

      o.get_fromfilepath(depfilepath, function (err, depnode) {
        if (err) return oncompletefn(err);

        onnodefn(depnode, accumstart,  node, deparr[0], function (err, accum) {
          if (err) return oncompletefn(err);

          o.walk(node, opts, accum, onnodefn, oncompletefn, deparr.slice(1));
        });
      });
    } else {
      oncompletefn(null, accumstart);
    }
  };
  
  // walks node childs, recursive
  o.walkrecursive = function (node, opts, accumstart, iswalkcontinuefn, accumfn, accumcompletefn) {
    o.walk(node, opts, accumstart, function onnodefn (node, accumstart, pnode, refname, nextfn) {    
      var accum = accumfn(accumstart, node, pnode, refname);

      if (iswalkcontinuefn(accumstart, node, pnode, refname)) {
        o.walkrecursive(node, opts, accum, iswalkcontinuefn, accumfn, nextfn);
      } else {
        nextfn(null, accum);
      }
    }, accumcompletefn);
  };

  o.walkbegin = function (node, opts, accumstart, iswalkcontinuefn, accumfn, accumcompletefn) {
    var accum = accumfn(accumstart, node, null);
    
    o.walkrecursive(node, opts, accum, iswalkcontinuefn, accumfn, accumcompletefn);
  };

  o.walkbeginfile = function (filepath, opts, accum, iswalkcontinuefn, accumfn, accumcompletefn) {
    o.get_fromfilepath(filepath, function (err, node) {
      if (err) return accumcompletefn(err);

      return o.walkbegin(node, opts, accum, iswalkcontinuefn, accumfn, accumcompletefn);
    });
  };
  
  return o;
  
}({}));
