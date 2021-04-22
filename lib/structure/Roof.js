const { Vec3 } = require('vec3')

/**
 * Builds a custom shaped roof based on the given input options. Works by sampling the height at multiple
 * locations within each target block to generate a set of staircases, half slabs, and full blocks to closely
 * approximate the given input formula.
 *
 * @param {*} options - The options to generate the roof with.
 *  * placeBlock - An async function callback for actually placing the block in the world.
 *  * mapper - The roof mapper for sampling the best block to place at the given location.
 *  * roofLocations - A list of block locations representing the horizontal foundation of the roof. One roof block
 *                    is placed at every horizontal location. Provided y axis is offset by the roof height to get
 *                    the final block height.
 *  * getHeightAt - A function callback for actually sampling the height at the given subpixel location.
 *  * placeUndersides - A boolean flag to determine if stairs/slabs should be placed under the roof to smooth out
 *                      sharp underside edges.
 */
async function buildRoof (options) {
  const placeBlock = options.placeBlock
  const mapper = options.mapper
  const roofLocations = options.roofLocations
  const getHeightAt = options.getHeightAt
  const placeUndersides = options.placeUndersides

  const placedRoofBlocks = []

  for (const loc of roofLocations) {
    const corners = [
      new Vec3(loc.x + 0.25, loc.y, loc.z + 0.25),
      new Vec3(loc.x + 0.75, loc.y, loc.z + 0.25),
      new Vec3(loc.x + 0.25, loc.y, loc.z + 0.75),
      new Vec3(loc.x + 0.75, loc.y, loc.z + 0.75)
    ]

    for (const c of corners) {
      c.y += getHeightAt(c)
    }

    const height = Math.min(...corners.map(c => c.y))
    const vec = loc.offset(0, height, 0)
    await placeBlock(vec, mapper.getTopBlock(corners))
    placedRoofBlocks.push(vec.floor())
  }

  const originalPlacedRoof = [...placedRoofBlocks]
  for (const loc of originalPlacedRoof) {
    const min = Math.min(...originalPlacedRoof
      .filter(b => new Vec3(b.x, loc.y, b.z).manhattanDistanceTo(loc) === 1)
      .map(b => b.y))

    for (let y = loc.y - 1; y >= min; y--) {
      const vec = new Vec3(loc.x, y, loc.z)
      await placeBlock(vec, mapper.getFullBlock())
      placedRoofBlocks.push(vec)
    }
  }

  if (placeUndersides) {
    for (let block of placedRoofBlocks) {
      block = block.offset(0, -1, 0)
      if (placedRoofBlocks.some(b => b.manhattanDistanceTo(block) === 0)) continue

      const neighbors = [
        placedRoofBlocks.some(b => b.offset(0, 0, 1).manhattanDistanceTo(block) === 0),
        placedRoofBlocks.some(b => b.offset(1, 0, 0).manhattanDistanceTo(block) === 0),
        placedRoofBlocks.some(b => b.offset(0, 0, -1).manhattanDistanceTo(block) === 0),
        placedRoofBlocks.some(b => b.offset(-1, 0, 0).manhattanDistanceTo(block) === 0)
      ]

      const id = mapper.getBottomBlock(neighbors)
      if (id === 0) continue

      await placeBlock(block, id)
    }
  }
}

module.exports = { buildRoof }
