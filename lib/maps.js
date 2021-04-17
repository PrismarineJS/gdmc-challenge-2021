
const { Vec3 } = require('vec3')

class Maps {
  constructor (world, bounds, mcData) {
    this.x0 = bounds[0]
    this.x1 = bounds[1]
    this.z0 = bounds[2]
    this.z1 = bounds[3]
    this.heights = []
    this.waters = []
    const total = (this.x1 - this.x0 + 1) * (this.z1 - this.z0 + 1)
    let cur = 0

    const ignoreBlocks = [
      mcData.blocksByName.air.id,
      mcData.blocksByName.leaves.id,
      mcData.blocksByName.log.id,
      mcData.blocksByName.log2.id,
      mcData.blocksByName.double_plant.id,
      mcData.blocksByName.yellow_flower.id,
      mcData.blocksByName.red_flower.id,
      mcData.blocksByName.tallgrass.id
    ]

    for (let z = this.z0; z <= this.z1; z++) {
      this.heights.push([])
      this.waters.push([])
      for (let x = this.x0; x <= this.x1; x++) {
        let y = 255
        for (; y >= 0; y--) {
          const b = world.getBlockType(new Vec3(x, y, z))
          if (ignoreBlocks.indexOf(b) === -1) break
        }
        const b = world.getBlock(new Vec3(x, y, z))
        this.heights[z - this.z0].push(y)
        this.waters[z - this.z0].push(b.type !== mcData.blocksByName.water.id ? 0 : 1)
        cur++
        if (cur % 10000 === 0) console.log(`Progress: ${Math.floor(cur / total * 100)}%`)
      }
    }
  }

  height (x, z) {
    if (x < this.x0 || z < this.z0 || x > this.x1 || z > this.z1) return -1
    return this.heights[Math.floor(z - this.z0)][Math.floor(x - this.x0)]
  }

  water (x, z) {
    if (x < this.x0 || z < this.z0 || x > this.x1 || z > this.z1) return -1
    return this.waters[Math.floor(z - this.z0)][Math.floor(x - this.x0)]
  }
}

module.exports = Maps
