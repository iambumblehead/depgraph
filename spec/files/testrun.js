import depgraph from '../../src/depgraph.js'
import archy from 'archy'

const graphroot = async () => {
  const graph = await depgraph.graph.getfromseedfile('./spec/files/root.js', {})

  console.log(JSON.stringify(graph, null, '  '))
  console.log('\n')
}

const treeroot = async () => {
  const tree = await depgraph.tree.getfromseedfile('./spec/files/root.js', {})

  console.log(archy(tree))
  console.log('\n')
}

const treerootsmall = async () => {
  const tree = await depgraph.tree
    .getfromseedfilesmall('./spec/files/root.js', {})

  console.log(archy(tree))
  console.log('\n')
}

const treerootbrowsersmall = async () => {
  const tree = await depgraph.tree
    .getfromseedfilesmall('./spec/files/root.js', { browser: true })

  console.log(archy(tree))
}

(async () => {
  await graphroot(),
  await treeroot(),
  await treerootsmall(),
  await treerootbrowsersmall()
})()
