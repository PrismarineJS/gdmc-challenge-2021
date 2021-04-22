const mcServer = require('flying-squid')

mcServer.createMCServer({
  motd: 'The PrismarineJS community GDMC Competition 2021 Entry',
  port: 25565,
  'max-players': 10,
  'online-mode': false,
  logging: true,
  gameMode: 1,
  difficulty: 0,
  worldFolder: 'server/1.16.4/world',
  generation: {
    name: 'superflat',
    options: {
    }
  },
  kickTimeout: 10000,
  plugins: {
  },
  modpe: false,
  'view-distance': 10,
  'player-list-text': {
    header: 'GDMC Competition 2021 Entry',
    footer: 'Developed by PrismarineJS'
  },
  'everybody-op': true,
  'max-entities': 100,
  version: '1.16.1'
})
