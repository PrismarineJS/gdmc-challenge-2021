function getMapPostFlattening (Block, slabID, stairID, blockID) {
  return [
    Block.fromProperties(slabID, { type: 'bottom', waterlogged: false }, 0).stateId,
    Block.fromProperties(stairID, { facing: 'north', half: 'bottom', shape: 'outer_left', waterlogged: false }, 0).stateId,
    Block.fromProperties(stairID, { facing: 'north', half: 'bottom', shape: 'outer_right', waterlogged: false }, 0).stateId,
    Block.fromProperties(stairID, { facing: 'north', half: 'bottom', shape: 'straight', waterlogged: false }, 0).stateId,
    Block.fromProperties(stairID, { facing: 'west', half: 'bottom', shape: 'outer_left', waterlogged: false }, 0).stateId,
    Block.fromProperties(stairID, { facing: 'west', half: 'bottom', shape: 'straight', waterlogged: false }, 0).stateId,
    blockID,
    Block.fromProperties(stairID, { facing: 'west', half: 'bottom', shape: 'inner_right', waterlogged: false }, 0).stateId,
    Block.fromProperties(stairID, { facing: 'south', half: 'bottom', shape: 'outer_left', waterlogged: false }, 0).stateId,
    blockID,
    Block.fromProperties(stairID, { facing: 'east', half: 'bottom', shape: 'straight', waterlogged: false }, 0).stateId,
    Block.fromProperties(stairID, { facing: 'east', half: 'bottom', shape: 'inner_left', waterlogged: false }, 0).stateId,
    Block.fromProperties(0, { facing: 'south', half: 'bottom', shape: 'straight', waterlogged: false }, 0).stateId,
    Block.fromProperties(0, { facing: 'south', half: 'bottom', shape: 'inner_right', waterlogged: false }, 0).stateId,
    Block.fromProperties(0, { facing: 'south', half: 'bottom', shape: 'inner_left', waterlogged: false }, 0).stateId,
    blockID,

    Block.fromProperties(slabID, { type: 'top', waterlogged: false }, 0).stateId,
    Block.fromProperties(stairID, { facing: 'north', half: 'top', shape: 'outer_left', waterlogged: false }, 0).stateId,
    Block.fromProperties(stairID, { facing: 'north', half: 'top', shape: 'outer_right', waterlogged: false }, 0).stateId,
    Block.fromProperties(stairID, { facing: 'north', half: 'top', shape: 'straight', waterlogged: false }, 0).stateId,
    Block.fromProperties(stairID, { facing: 'west', half: 'top', shape: 'outer_left', waterlogged: false }, 0).stateId,
    Block.fromProperties(stairID, { facing: 'west', half: 'top', shape: 'straight', waterlogged: false }, 0).stateId,
    blockID,
    Block.fromProperties(stairID, { facing: 'west', half: 'top', shape: 'inner_right', waterlogged: false }, 0).stateId,
    Block.fromProperties(stairID, { facing: 'south', half: 'top', shape: 'outer_left', waterlogged: false }, 0).stateId,
    blockID,
    Block.fromProperties(stairID, { facing: 'east', half: 'top', shape: 'straight', waterlogged: false }, 0).stateId,
    Block.fromProperties(stairID, { facing: 'east', half: 'top', shape: 'inner_left', waterlogged: false }, 0).stateId,
    Block.fromProperties(0, { facing: 'south', half: 'top', shape: 'straight', waterlogged: false }, 0).stateId,
    Block.fromProperties(0, { facing: 'south', half: 'top', shape: 'inner_right', waterlogged: false }, 0).stateId,
    Block.fromProperties(0, { facing: 'south', half: 'top', shape: 'inner_left', waterlogged: false }, 0).stateId,
    blockID,

    blockID
  ]
}

function getMapPreFlattening (slabBotID, slabTopID, stairID, blockID) {
  return [
    slabBotID,
    stairID + 3,
    stairID + 3,
    stairID + 3,
    stairID + 1,
    stairID + 1,
    slabBotID,
    blockID,
    stairID + 0,
    slabBotID,
    stairID + 0,
    blockID,
    stairID + 2,
    blockID,
    blockID,
    blockID,

    0,
    stairID + 7,
    stairID + 4,
    stairID + 7,
    stairID + 6,
    slabTopID,
    stairID + 4,
    slabTopID,
    stairID + 5,
    stairID + 5,
    slabTopID,
    slabTopID,
    stairID + 5,
    slabTopID,
    slabTopID,
    slabTopID,

    blockID
  ]
}

function getSpruce (mcData) {
  if (mcData.version.version < 389) { // pre-flattening
    const slabBotID = (mcData.blocksByName.wooden_slab.id << 4) + 1
    const slabTopID = (mcData.blocksByName.wooden_slab.id << 4) + 9
    const stairID = (mcData.blocksByName.spruce_stairs.id << 4) + 0
    const blockID = (mcData.blocksByName.planks.id << 4) + 1
    return getMapPreFlattening(slabBotID, slabTopID, stairID, blockID)
  } else { // post-flattening
    const Block = require('prismarine-block')(mcData.version)
    const slabID = mcData.blocksByName.spruce_slab.id
    const stairID = mcData.blocksByName.spruce_stairs.id
    const blockID = mcData.blocksByName.spruce_planks.id
    return getMapPostFlattening(Block, slabID, stairID, blockID)
  }
}

function getMap (mcData, blockType) {
  switch (blockType) {
    case 'spruce': return getSpruce(mcData)
    default: throw new Error(`Unsupported block type '${blockType}'!`)
  }
}

class RoofMapper {
  constructor (mcData, blockType) {
    this.map = getMap(mcData, blockType)
  }

  getTopBlock (corners) {
    const highest = Math.floor(Math.min(...corners.map(c => c.y))) + 0.5

    let index = 0
    index |= corners[0].y >= highest ? 1 : 0
    index |= corners[1].y >= highest ? 2 : 0
    index |= corners[2].y >= highest ? 4 : 0
    index |= corners[3].y >= highest ? 8 : 0

    return this.map[index]
  }

  getBottomBlock (neighbors) {
    let index = 16
    index |= neighbors[0] ? 1 : 0
    index |= neighbors[1] ? 2 : 0
    index |= neighbors[2] ? 4 : 0
    index |= neighbors[3] ? 8 : 0

    return this.map[index]
  }

  getFullBlock () {
    return this.map[32]
  }
}

module.exports = RoofMapper
