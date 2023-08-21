#! /usr/bin/env node
const shell = require('shelljs')
const { path } = require('app-root-path')
const fs = require('fs')
const os = require('os')
const join = require('path').join

function rm(path) {
  try {
    fs.rmSync(path, { recursive: true, force: true })
  } catch (e) {
    console.warn(`Failed to delete ${path}, continuing..`)
  }
}

console.log(`clean-rn: Cleaning React Native caches for ${path}..`)

// npm
rm(join(path, 'node_modules'))

rm(join(path, 'yarn.lock'))
shell.exec('yarn cache clean')

rm(join(path, 'package-lock.json'))
shell.exec('npm cache clean --force')

// android
const androidPaths=[
  '.gradle',
  '.idea',
  '.cxx',
  'build',
  'build',
  join('app', 'build'),
  join('app', '.cxx'),
]
androidPaths.forEach((p) => rm(join(path, 'android', p)))


shell.exec(join(path, 'android', 'gradlew --stop')) // stop gradle daemon
rm(join(os.homedir(), '.gradle', 'caches'))
shell.exec(join(path, 'android', 'gradlew clean'))

// ios
const iosPaths=[
  'build',
  'Pods',
  'DerivedData',
]
iosPaths.forEach((p) => rm(join(path, 'ios', p)))
console.log('Cleaned everything! Run:\n  - yarn/npm i\n  - cd ios && pod repo update && pod update\n..to reinstall everything!')
