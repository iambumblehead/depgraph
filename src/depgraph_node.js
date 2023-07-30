// Filename: depgraph_node.js  
// Timestamp: 2018.03.30-03:33:47 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

import fs from 'fs'
import path from 'path'
import fnguard from 'fnguard'
import detective from 'detective'
import detectivees6 from 'detective-es6'
import immutable from 'immutable'
import moduletype from 'moduletype'
import resolveuid from 'resolveuid'
import resolvewithplus from 'resolvewithplus'
import detectivetypescript from 'detective-typescript'
    
import depgraph_edge from './depgraph_edge.js'

export default (o => {

  // 'in'  are dependents
  // 'out' are dependencies
  //
  // nodes with 'in' degree of 0 are tree root nodes
  o.get = (filepath, filecontent, uid) =>
    immutable.Map({
      module   : moduletype.is(filecontent),
      content  : filecontent,
      filepath : filepath,
      uid      : uid || resolveuid(filepath),
      inarr    : immutable.List(),
      outarr   : immutable.List()
    });

  o.get_fromjs = js =>
    immutable.Map(js).merge(
      immutable.Map({
        outarr : immutable.List(js.outarr.map(immutable.Map) || []),
        inarr  : immutable.List(js.inarr.map(immutable.Map) || [])
      }));

  o.get_fromfilepath = (filepath, fn) => {
    fnguard.isstr(filepath).isfn(fn);

    filepath = path.resolve(filepath);

    fs.readFile(filepath, 'utf-8', (err, filestr) => {
      err ? fn(err) : fn(null, o.get(filepath, filestr));
    });      
  };

  o.get_fromfilepathrel = (filepath, opts, fn) => {
    var fullpath = resolvewithplus(filepath, '.' + path.sep, opts);

    if (!fullpath) {
      return fn('dep not found, "' + filepath + '": ' + fullpath);
    }
    
    o.get_fromfilepath(fullpath, fn);
  };

  o.get_arrfromfilepathrel = (filepatharr, opts, fn) => {
    var nodesarr = [];
    
    (function nextdep (filepatharr, x, prepend) {
      if (!x--) return fn(null, nodesarr);

      o.get_fromfilepathrel(filepatharr[x], opts, (err, res) => {
        if (err) return fn(err);

        nodesarr.push(res);
        
        nextdep(filepatharr, x);        
      });
    }(filepatharr, filepatharr.length));
  };

  o.setedge = (node, uid, refname, edgename) => {
    var edge = depgraph_edge.get(refname, uid);

    return node.set(edgename, node.get(edgename).filter((inedge) => (
      depgraph_edge.issamenot(edge, inedge)
    )).push(edge));
  };
  
  o.setedgein = (node, uid, refname) => 
    o.setedge(node, uid, refname, 'inarr');

  o.setedgeout = (node, uid, refname) =>
    o.setedge(node, uid, refname, 'outarr');

  o.detectivetype = (node, filepath) => {
    let detectivetype = detective;

    if (/.[mj]sx?$/.test(filepath)) {
      detectivetype = content =>
        detectivees6(content)
        .concat(detective(content, {
          parse: {
            sourceType: 'module',
            allowImportExportEverywhere: true
          }
        }));
    } else if (/.ts$/.test(filepath)) {
      detectivetype = detectivetypescript
    }

    return detectivetype;
  };

  // rm spread operator { ...namespace }
  o.rmspread = str =>
    str.replace(/\.\.\./g, '');

  o.detective = (node) => {
    let filepath = node.get('filepath'),
        detectivetype = o.detectivetype(node, filepath);
    
    try {
      return detectivetype(node.get('content'));
    } catch (e) {
      console.error(e);
      throw new Error('[!!!] error: ' + filepath);
    }
  };

  // walks node childs
  o.walk = (node, opts, accumstart, onnodefn, oncompletefn, deparr) => {
    var nodefilepath = node.get('filepath'),
        depfilepath,
        skipdeparr = opts.skipdeparr || [],
        aliasarr = opts.aliasarr || [];

    deparr = deparr || o.detective(node);

    // very inefficient :)
    aliasarr.map(([matchname, newname]) => (
      deparr = deparr.map(dep => dep === matchname ? newname : dep)
    ));

    if (!skipdeparr
        .some((skip) => nodefilepath.indexOf(skip) !== -1) &&
        deparr.length && // coremodule ignored
        !resolvewithplus.iscoremodule(deparr[0])) {

      if (!(depfilepath = resolvewithplus(deparr[0], nodefilepath, opts))) {
        return oncompletefn('dep not found, "' + deparr[0] + '": ' + nodefilepath);
      }

      o.get_fromfilepath(depfilepath, (err, depnode) => {
        if (err) return oncompletefn(err);

        onnodefn(depnode, accumstart,  node, deparr[0], (err, accum) => {
          if (err) return oncompletefn(err);

          o.walk(node, opts, accum, onnodefn, oncompletefn, deparr.slice(1));
        });
      });
    } else {
      oncompletefn(null, accumstart);
    }
  };
  
  // walks node childs, recursive
  o.walkrecursive = (node, opts, accumstart, iswalkcontinuefn, accumfn, accumcompletefn) => {
    o.walk(node, opts, accumstart, function onnodefn (node, accumstart, pnode, refname, nextfn) {    
      var accum = accumfn(accumstart, node, pnode, refname);

      if (iswalkcontinuefn(accumstart, node, pnode, refname)) {
        o.walkrecursive(node, opts, accum, iswalkcontinuefn, accumfn, nextfn);
      } else {
        nextfn(null, accum);
      }
    }, accumcompletefn);
  };

  o.walkbegin = (node, opts, accumstart, iswalkcontinuefn, accumfn, accumcompletefn) => {
    var accum = accumfn(accumstart, node, null);
    
    o.walkrecursive(node, opts, accum, iswalkcontinuefn, accumfn, accumcompletefn);
  };

  o.walkbeginfile = (filepath, opts, accum, iswalkcontinuefn, accumfn, accumcompletefn) => {
    o.get_fromfilepath(filepath, (err, node) => {
      if (err) return accumcompletefn(err);

      return o.walkbegin(node, opts, accum, iswalkcontinuefn, accumfn, accumcompletefn);
    });
  };

  return o;
})({});
