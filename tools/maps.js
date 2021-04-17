const path = require('path')
const { preloadWorld, saveGrayscale, saveColor } = require('../lib/io')
const Maps = require('../lib/maps')

const commandLineArgs = require('command-line-args')
const options = commandLineArgs([
  { name: 'version', alias: 'v', type: String, defaultValue: '1.16.4' },
  { name: 'bounds', alias: 'b', type: Number, multiple: true, defaultValue: [-256, 256, -256, 256] },
  { name: 'input', alias: 'i', type: String, defaultValue: path.join(__dirname, '../server/1.16.4/world'), defaultOption: true }
])

async function generateMaps () {
  const world = (await preloadWorld(options.version, options.input, options.bounds)).sync
  const mcData = require('minecraft-data')(options.version)
  const maps = new Maps(world, options.bounds, mcData)

  console.log('saving heightmap.png...')
  await saveGrayscale('heightmap.png', maps.heights)
  console.log('saving watermap.png...')
  await saveColor('watermap.png', maps.waters, [0x00ff00, 0x0000ff])
  console.log('done')
  process.exit(0)
}

generateMaps()
