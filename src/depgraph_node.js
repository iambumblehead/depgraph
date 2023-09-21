// Filename: depgraph_node.js  
// Timestamp: 2018.03.30-03:33:47 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

import fs from 'node:fs/promises'
import url from 'node:url'
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

// 'in'  are dependents
// 'out' are dependencies
//
// nodes with 'in' degree of 0 are tree root nodes
const get = (filepath, filecontent, uid) => immutable.Map({
  module   : moduletype.is(filecontent),
  content  : filecontent,
  filepath : filepath,
  uid      : uid || resolveuid(filepath),
  inarr    : immutable.List(),
  outarr   : immutable.List()
});

const get_fromjs = js => immutable.Map(js).merge(
  immutable.Map({
    outarr : immutable.List(js.outarr.map(immutable.Map) || []),
    inarr  : immutable.List(js.inarr.map(immutable.Map) || [])
  }));

const get_fromfilepath = async (filepath) => {
  fnguard.isstr(filepath);

  filepath = filepath.startsWith('file://')
    ? url.fileURLToPath(filepath)
    : path.resolve(filepath);

  return get(filepath, await fs.readFile(filepath, { encoding: 'utf8' }))
};

const get_fromfilepathrel = async (filepath, opts) => {
  var fullpath = resolvewithplus(filepath, '.' + path.sep, opts);
  if (!fullpath)
    throw new Error('dep not found, "' + filepath + '": ' + fullpath);

  return get_fromfilepath(fullpath)
};

const get_arrfromfilepathrel = async (filepatharr, opts) => {
  const nodesarr = [];
  
  (async function nextdep (filepatharr, x, prepend) {
    if (!x--) return nodesarr;

    nodesarr.push(await get_fromfilepathrel(filepatharr[x], opts))
      
    return nextdep(filepatharr, x);        
  }(filepatharr, filepatharr.length));
};

const setedge = (node, uid, refname, edgename) => {
  var edge = depgraph_edge.get(refname, uid);

  return node.set(edgename, node.get(edgename).filter((inedge) => (
    depgraph_edge.issamenot(edge, inedge)
  )).push(edge));
};

const setedgein = (node, uid, refname) => 
      setedge(node, uid, refname, 'inarr');

const setedgeout = (node, uid, refname) =>
      setedge(node, uid, refname, 'outarr');

const detectivetype = (node, filepath) => {
  let dettype = detective;

  if (/.[mj]sx?$/.test(filepath)) {
    dettype = content => detectivees6(content).concat(detective(content, {
      parse: {
        sourceType: 'module',
        allowImportExportEverywhere: true
      }
    }));
  } else if (/.ts$/.test(filepath)) {
    dettype = detectivetypescript
  }

  return dettype;
};

// rm spread operator { ...namespace }
const rmspread = str =>
      str.replace(/\.\.\./g, '');

const ndetective = node => {
  let filepath = node.get('filepath'),
      dettype = detectivetype(node, filepath);
  
  try {
    return dettype(node.get('content'));
  } catch (e) {
    console.error(e);
    throw new Error('[!!!] error: ' + filepath);
  }
};

// walks node childs
const walk = async (node, opts, accumstart, onnodefn, deparr) => {
  var nodefilepath = node.get('filepath'),
      depfilepath,
      skipdeparr = opts.skipdeparr || [],
      aliasarr = opts.aliasarr || [];

  deparr = deparr || ndetective(node);

  // very inefficient :)
  aliasarr.map(([matchname, newname]) => (
    deparr = deparr.map(dep => dep === matchname ? newname : dep)
  ));

  if (!skipdeparr
      .some((skip) => nodefilepath.indexOf(skip) !== -1) &&
      deparr.length && // coremodule ignored
      !resolvewithplus.iscoremodule(deparr[0])) {

    if (!(depfilepath = resolvewithplus(deparr[0], nodefilepath, opts))) {
      throw new Error('dep not found, "' + deparr[0] + '": ' + nodefilepath);
    }

    const depnode = await get_fromfilepath(depfilepath)
    const accum = await onnodefn(depnode, accumstart,  node, deparr[0])

    return walk(node, opts, accum, onnodefn, deparr.slice(1));
  } else {
    return accumstart
  }
};

// walks node childs, recursive
const walkrecursive = async (node, opts, accumstart, iswalkcontinuefn, accumfn) => {
  return walk(node, opts, accumstart, async (node, accumstart, pnode, refname) => {
    var accum = accumfn(accumstart, node, pnode, refname);

    return iswalkcontinuefn(accumstart, node, pnode, refname)
      ? walkrecursive(node, opts, accum, iswalkcontinuefn, accumfn)
      : accum
  })
};

const walkbegin = async (node, opts, accumstart, iswalkcontinuefn, accumfn) => {
  var accum = accumfn(accumstart, node, null);

  return walkrecursive(node, opts, accum, iswalkcontinuefn, accumfn)
};

const walkbeginfile = async (filepath, opts, accum, iswalkcontinuefn, accumfn) => {
  const node = await get_fromfilepath(filepath)

  return walkbegin(node, opts, accum, iswalkcontinuefn, accumfn)
};

export default {
  get,
  get_fromjs,
  get_fromfilepath,
  get_fromfilepathrel,
  get_arrfromfilepathrel,
  setedge,
  setedgein,
  setedgeout,
  detectivetype,
  rmspread,
  ndetective,
  walk,
  walkrecursive,
  walkbegin,
  walkbeginfile
}
