import { is, Map } from 'immutable'

const get = (refname, uid) => Map({
  refname: refname,
  uid: uid
})
  
const issame = (edgea, edgeb) => (
  is(edgea, edgeb))

const issamenot = (edgea, edgeb) => (
  !issame(edgea, edgeb))

export default {
  get,
  issame,
  issamenot
}
