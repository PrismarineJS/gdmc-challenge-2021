const { Wrap, download } = require('minecraft-wrap')
const path = require('path')
const fs = require('fs-extra')

const commandLineArgs = require('command-line-args')
const options = commandLineArgs([
  { name: 'version', alias: 'v', type: String, defaultValue: '1.16.1' },
  { name: 'seed', alias: 's', type: String, defaultValue: '' }
])

const minecraftVersion = options.version

const propOverrides = {
  'level-seed': options.seed,
  'spawn-npcs': 'false',
  'spawn-animals': 'false',
  'online-mode': 'false',
  gamemode: '1',
  'spawn-monsters': 'false',
  'generate-structures': 'false',
  'enable-command-block': 'true',
  'server-port': 25565
}

const MC_SERVER_JAR_DIR = path.join(__dirname, '../', 'server_jars')
const MC_SERVER_JAR = path.join(MC_SERVER_JAR_DIR, `minecraft_server.${minecraftVersion}.jar`)
const MC_SERVER_PATH = path.join(__dirname, '../', 'server')

fs.ensureDirSync(MC_SERVER_JAR_DIR)
fs.ensureDirSync(MC_SERVER_PATH)

const wrap = new Wrap(MC_SERVER_JAR, path.join(MC_SERVER_PATH, `${minecraftVersion}`))

console.log('Downloading server...')
download(minecraftVersion, MC_SERVER_JAR, (err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('Starting server...')
  wrap.startServer(propOverrides, (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Started.')
    }
  })
})
