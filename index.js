#! /usr/bin/env node
const shell = require('shelljs')
const { path } = require('app-root-path')

console.log("Hello " + path)

shell.exec(`rm -rf ${path}/node_modules`)
