const commandLineArgs = require('command-line-args')
const options = commandLineArgs([
  { name: 'version', alias: 'v', type: String, defaultValue: '1.16.1' },
  { name: 'bounds', alias: 'b', type: Number, multiple: true, defaultValue: [-256, 256, -256, 256] },
  { name: 'name', alias: 'n', type: String, defaultValue: 'default' }
])

const version = options.version
const bounds = options.bounds
const name = options.name

const World = require('prismarine-world')(version)
const Anvil = require('prismarine-provider-anvil').Anvil(version)
const Vec3 = require('vec3')
const fs = require('fs-extra')

fs.removeSync(`./village/${name}/${version}/world`)
fs.copySync(`./world_download/${version}/world`, `./village/${name}/${version}/world`)

const regionPath = `./village/${name}/${version}/world/region`
const world = new World(null, new Anvil(regionPath))

// Placeholder
async function generateCircle () {
  const p1 = new Vec3(bounds[0], 70, bounds[2])
  const p2 = new Vec3(bounds[1], 70, bounds[3])
  const center = p1.add(p2).scale(0.5)

  for (let x = -10; x <= 10; x++) {
    for (let z = -10; z <= 10; z++) {
      const vec = new Vec3(x, 0, z)
      if (vec.distanceTo(new Vec3(0, 0, 0)) >= 10) continue
      await world.setBlockStateId(vec.add(center), 1)
    }
  }

  world.stopSaving()
  await world.saveNow()
}

generateCircle().catch(console.log)
