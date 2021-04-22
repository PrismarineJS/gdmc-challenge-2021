const World = require('prismarine-world')('1.16.1')
const Anvil = require('prismarine-provider-anvil').Anvil('1.16.1')
const Vec3 = require('vec3')

const regionPath = './server/1.16.1/world/region'
const world = new World(null, new Anvil(regionPath))

// Placeholder
async function generateCircle () {
  const center = new Vec3(0, 70, 0)

  for (let x = -10; x <= 10; x++) {
    for (let z = -10; z <= 10; z++) {
      const vec = new Vec3(x, 70, z)
      if (vec.distanceTo(center) >= 10) continue
      await world.setBlockStateId(vec, 1)
    }
  }

  world.stopSaving()
  await world.saveNow()
}

generateCircle().catch(console.log)
