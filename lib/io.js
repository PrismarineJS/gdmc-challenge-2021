const fs = require('fs')
const { once } = require('events')
const { createCanvas } = require('canvas')
const path = require('path')

async function preloadWorld (mcVersion, worldDir, bounds) {
  const Anvil = require('prismarine-provider-anvil').Anvil(mcVersion)
  const World = require('prismarine-world')(mcVersion)

  const world = new World(null, new Anvil(path.join(worldDir, 'region')))
  const biomes = []
  const total = (Math.floor(bounds[1] / 16) - Math.floor(bounds[0] / 16) + 1) * (Math.floor(bounds[3] / 16) - Math.floor(bounds[2] / 16) + 1)
  let cur = 0
  for (let z = Math.floor(bounds[2] / 16); z <= Math.floor(bounds[3] / 16); z++) {
    biomes.push([])
    for (let x = Math.floor(bounds[0] / 16); x <= Math.floor(bounds[1] / 16); x++) {
      await world.getColumn(x, z)
      cur++
      if (cur % 100 === 0) console.log(`Preloading: ${Math.floor(cur / total * 100)}%`)
    }
  }

  return world
}

async function saveBiomes (path, biomes, mcVersion) {
  const mcData = require('minecraft-data')(mcVersion)
  const height = biomes.length
  const width = biomes[0].length

  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(width, height)

  let i = 0
  for (let z = 0; z < height; z++) {
    for (let x = 0; x < width; x++) {
      const c = mcData.biomes[biomes[z][x]].color
      img.data[i++] = (c >> 16) & 0xff
      img.data[i++] = (c >> 8) & 0xff
      img.data[i++] = (c >> 0) & 0xff
      img.data[i++] = 0xff
    }
  }
  ctx.putImageData(img, 0, 0)

  const out = fs.createWriteStream(path)
  const stream = canvas.createPNGStream()
  stream.pipe(out)
  await once(out, 'finish')
}

async function saveColor (path, data) {
  const height = data.length
  const width = data[0].length

  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(width, height)

  let i = 0
  for (let z = 0; z < height; z++) {
    for (let x = 0; x < width; x++) {
      const c = data[z][x]
      img.data[i++] = (c >> 16) & 0xff
      img.data[i++] = (c >> 8) & 0xff
      img.data[i++] = (c >> 0) & 0xff
      img.data[i++] = 0xff
    }
  }
  ctx.putImageData(img, 0, 0)

  const out = fs.createWriteStream(path)
  const stream = canvas.createPNGStream()
  stream.pipe(out)
  await once(out, 'finish')
}

async function saveGrayscale (path, data) {
  const height = data.length
  const width = data[0].length

  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(width, height)

  let i = 0
  for (let z = 0; z < height; z++) {
    for (let x = 0; x < width; x++) {
      const c = data[z][x]
      img.data[i++] = c & 0xff
      img.data[i++] = c & 0xff
      img.data[i++] = c & 0xff
      img.data[i++] = 0xff
    }
  }
  ctx.putImageData(img, 0, 0)

  const out = fs.createWriteStream(path)
  const stream = canvas.createPNGStream()
  stream.pipe(out)
  await once(out, 'finish')
}

module.exports = { preloadWorld, saveBiomes, saveColor, saveGrayscale }
