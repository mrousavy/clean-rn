#! /usr/bin/env node
const shell = require('shelljs')
const { path: appRoot } = require('app-root-path')
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

console.log(`clean-rn: Cleaning React Native caches for ${appRoot}..`)

// npm
rm(join(appRoot, 'node_modules'))

if(fs.existsSync(join(appRoot, 'package-lock.json'))) {
  shell.exec('npm cache clean --force')
  rm(join(appRoot, 'package-lock.json'))
} else if(fs.existsSync(join(appRoot, 'yarn.lock'))) {
  shell.exec('yarn cache clean')
  rm(join(appRoot, 'yarn.lock'))
} else if(fs.existsSync(join(appRoot, 'pnpm-lock.yaml'))) {
  shell.exec('pnpm store prune')
  rm(join(appRoot, 'pnpm-lock.yaml'))
}

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
androidPaths.forEach((p) => rm(join(appRoot, 'android', p)))


shell.exec(join(appRoot, 'android', 'gradlew --stop')) // stop gradle daemon
rm(join(os.homedir(), '.gradle', 'caches'))
shell.exec(join(appRoot, 'android', 'gradlew clean'))

// ios
const iosPaths=[
  'build',
  'Pods',
  'Podfile.lock',
  'DerivedData',
]
iosPaths.forEach((p) => rm(join(appRoot, 'ios', p)))
console.log('Cleaned everything! Run:\n  - yarn/npm i\n  - cd ios && pod repo update && pod update\n..to reinstall everything!')
