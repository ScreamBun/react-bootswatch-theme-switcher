#!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const npm = require('npm');

const MODULES_DIR = path.join(__dirname, "..", "node_modules")
const LIB_DIR = path.join(__dirname, "..", "lib")
const package = require('../package.json')


let pkgs = []
// console.log(package)
for (let key of ["dependencies", "devDependencies"]) {
  if (key in package) {
    pkgs.push(...Object.keys(package[key]).map(k => k+"@"+package[key][k]))
  }
}

console.log(pkgs.join(" "))
/*
// console.log(pkgs)
npm.load(function(err) {
  // handle errors
  //npm.install(pkgs)
  npm.ls(pkgs, (er, data, lite) => {
    console.log(Object.keys(data))
  })
})

if (fs.pathExistsSync(MODULES_DIR) && !fs.pathExistsSync(LIB_DIR)) {
  npm.load(function(err) {
    // handle errors
    npm.run(['build'])
  })
}
*/