#! /usr/bin/env node
const shell = require('shelljs')
const { path } = require('app-root-path')
const fs = require("fs")

function rm(path) {
  try {
    fs.rmSync(path, { recursive: true, force: true })
  } catch (e) {
    console.warn(`Failed to delete ${path}, continuing..`)
  }
}

console.log(`clean-rn: Cleaning React Native caches for ${path}..`)

// npm
rm(`${path}/node_modules`)

rm(`${path}/yarn.lock`)
shell.exec("yarn cache clean")

rm(`${path}/package-lock.json`)
shell.exec("npm cache clean --force")

// android
rm(`${path}/android/.gradle`)
rm(`${path}/android/.idea`)
rm(`${path}/android/.cxx`)
rm(`${path}/android/build`)
rm(`${path}/android/app/build`)
rm(`${path}/android/app/.cxx`)
rm(`$HOME/.gradle/caches`)
shell.exec("./android/gradlew cleanBuildCache")

// ios
rm(`${path}/ios/build`)
rm(`${path}/ios/Pods`)
rm(`${path}/ios/DerivedData`)

console.log("Cleaned everything! Run:\n  - yarn/npm i\n  - cd ios && pod repo update && pod update\n..to reinstall everything!")
