import * as immutable from 'immutable'

const get = (refname, uid) => immutable.Map({
  refname: refname,
  uid: uid
})
  
const issame = (edgea, edgeb) => (
  immutable.is(edgea, edgeb))

const issamenot = (edgea, edgeb) => (
  !issame(edgea, edgeb))

export default {
  get,
  issame,
  issamenot
}
