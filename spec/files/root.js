// Timestamp: 2015.12.15-07:30:22 (last modified)

import resolveuid from 'resolveuid'
import fileb from './fileb.js'
import filea from './filea.js'
import filec from './filec/index.js'
import filed from './dir/filed.js'

export default {
  resolveuid,
  name: 'root',
  filea: filea,
  fileb: fileb,
  filec: filec,
  filed: filed  
}
