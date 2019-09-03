#!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const npm = require('npm');

const MODULES_DIR = path.join(__dirname, "..", "node_modules")
const LIB_DIR = path.join(__dirname, "..", "lib")

if (!fs.pathExistsSync(MODULES_DIR)) {
  npm.load(function(err) {
    // handle errors
    npm.commands.install()
  })
}

if (fs.pathExistsSync(MODULES_DIR) && !fs.pathExistsSync(LIB_DIR)) {
  npm.load(function(err) {
    // handle errors
    npm.commands.run(['build'])
  })
}