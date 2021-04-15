# gdmc-challenge-2021

[![NPM version](https://img.shields.io/npm/v/gdmc-challenge-2021.svg)](http://npmjs.com/package/gdmc-challenge-2021)
[![Build Status](https://github.com/PrismarineJS/gdmc-challenge-2021/workflows/CI/badge.svg)](https://github.com/PrismarineJS/gdmc-challenge-2021/actions?query=workflow%3A%22CI%22)
[![Discord](https://img.shields.io/badge/chat-on%20discord-brightgreen.svg)](https://discord.gg/GsEFRM8)
[![Try it on gitpod](https://img.shields.io/badge/try-on%20gitpod-brightgreen.svg)](https://gitpod.io/#https://github.com/PrismarineJS/gdmc-challenge-2021)

The PrismarineJS entry for the 2021 Generative in Design Minecraft Competition.

## Getting started

Run `npm i` to install the dependencies.

### Tools

Generate a 512x512 test world:
```
node tools/genworld.js --seed 6708951544769826080 --bounds -256 256 -256 256 --version 1.16.4
```

Generate a biomemap as a png image:
```
node tools/biomemap.js --input ./server/1.16.4/world --bounds -256 256 -256 256 --output biomemap.png --version 1.16.4
```

Generate a heightmap as a png image:
```
node tools/heightmap.js --input ./server/1.16.4/world --bounds -256 256 -256 256 --output heightmap.png --version 1.16.4
```

Generate a watermap as a png image:
```
node tools/watermap.js --input ./server/1.16.4/world --bounds -256 256 -256 256 --output watermap.png --version 1.16.4
```