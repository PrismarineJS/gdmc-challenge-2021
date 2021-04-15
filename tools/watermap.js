const path = require('path')
const { Vec3 } = require('vec3')
const { preloadWorld, saveColor } = require('../lib/io')

const commandLineArgs = require('command-line-args')
const options = commandLineArgs([
  { name: 'version', alias: 'v', type: String, defaultValue: '1.16.4' },
  { name: 'bounds', alias: 'b', type: Number, multiple: true, defaultValue: [-256, 256, -256, 256] },
  { name: 'input', alias: 'i', type: String, defaultValue: path.join(__dirname, '../server/1.16.4/world'), defaultOption: true },
  { name: 'output', alias: 'o', type: String, defaultValue: 'watermap.png' }
])

async function generateMap () {
  const world = (await preloadWorld(options.version, options.input, options.bounds)).sync
  const mcData = require('minecraft-data')(options.version)

  const x0 = options.bounds[0]
  const x1 = options.bounds[1]
  const z0 = options.bounds[2]
  const z1 = options.bounds[3]

  const waterColor = 0x0000ff
  const landColor = 0x00ff00

  const colors = []
  const total = (x1 - x0 + 1) * (z1 - z0 + 1)
  let cur = 0
  for (let z = z0; z <= z1; z++) {
    colors.push([])
    for (let x = x0; x <= x1; x++) {
      let y = 255
      for (; y >= 0; y--) {
        const b = world.getBlockStateId(new Vec3(x, y, z))
        if (b && b !== 0) break
      }
      const b = world.getBlock(new Vec3(x, y, z))
      colors[z - z0].push(b.type !== mcData.blocksByName.water.id ? landColor : waterColor)
      cur++
      if (cur % 10000 === 0) console.log(`Progress: ${Math.floor(cur / total * 100)}%`)
    }
  }

  console.log(`saving ${options.output}...`)
  await saveColor(options.output, colors)
  console.log('done')
  process.exit(0)
}

generateMap()
