const { Wrap, download } = require('minecraft-wrap')
const path = require('path')
const fs = require('fs-extra')
const mineflayer = require('mineflayer')
const { once } = require('events')

const commandLineArgs = require('command-line-args')
const options = commandLineArgs([
  { name: 'version', alias: 'v', type: String, defaultValue: '1.16.4' },
  { name: 'port', alias: 'p', type: Number, defaultValue: 3000 },
  { name: 'bounds', alias: 'b', type: Number, multiple: true, defaultValue: [-256, 256, -256, 256] },
  { name: 'seed', alias: 's', type: String, defaultValue: '' }
])

const minecraftVersion = options.version

// World bounds
const x0 = options.bounds[0]
const x1 = options.bounds[1]
const z0 = options.bounds[2]
const z1 = options.bounds[3]

const propOverrides = {
  'level-seed': options.seed,
  'spawn-npcs': 'false',
  'spawn-animals': 'false',
  'online-mode': 'false',
  gamemode: '1',
  'spawn-monsters': 'false',
  'generate-structures': 'false',
  'enable-command-block': 'true',
  'server-port': options.port
}

const MC_SERVER_JAR_DIR = path.join(__dirname, '../', 'server_jars')
const MC_SERVER_JAR = path.join(MC_SERVER_JAR_DIR, `minecraft_server.${minecraftVersion}.jar`)
const MC_SERVER_PATH = path.join(__dirname, '../', 'server')

fs.ensureDirSync(MC_SERVER_JAR_DIR)
fs.ensureDirSync(MC_SERVER_PATH)
fs.removeSync(path.join(MC_SERVER_PATH, `${minecraftVersion}`, 'world'))

function wait (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const wrap = new Wrap(MC_SERVER_JAR, path.join(MC_SERVER_PATH, `${minecraftVersion}`))
wrap.on('line', (line) => {
  // console.log(line)
  if (line.includes('bot joined the game')) {
    generate()
  } else if (line.includes('Teleported')) {
    wrap.emit('tped')
  } else if (line.includes('Seed')) {
    wrap.emit('seed', line.split('Seed: ')[1])
  }
})

console.log('downloading server...')
download(minecraftVersion, MC_SERVER_JAR, (err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('starting server...')
  wrap.startServer(propOverrides, (err) => {
    if (err) {
      console.log(err)
      return
    }
    mineflayer.createBot({
      username: 'bot',
      viewDistance: 'tiny',
      port: options.port,
      host: 'localhost',
      version: minecraftVersion
    })
  })
})

async function generate () {
  console.log('starting generation...')
  const total = (Math.floor(x1 / 16) - Math.floor(x0 / 16) + 1) * (Math.floor(z1 / 16) - Math.floor(z0 / 16) + 1)
  let cur = 0
  for (let x = Math.floor(x0 / 16); x <= Math.floor(x1 / 16); x += 3) {
    for (let z = Math.floor(z0 / 16); z <= Math.floor(z1 / 16); z += 3) {
      wrap.writeServer(`tp bot ${x * 16 + 8} 255 ${z * 16 + 8}\n`)
      await once(wrap, 'tped')
      cur += 9
      if (cur % 10 === 0) console.log(`Generated ${cur} / ${total} chunks`)
      await wait(500)
    }
  }

  wrap.writeServer('seed\n')
  const [seed] = await once(wrap, 'seed')
  console.log(`Generated world with seed: ${seed}`)

  wrap.stopServer((err) => {
    if (err) {
      console.log(err)
      return
    }
    console.log('done')
  })
}
