#! /usr/bin/env node
const {existsSync, rmSync, readFileSync} = require('fs')
const {homedir} = require('os')
const {join} = require('path')
const {execSync:exec} = require('child_process')
const appRoot = process.cwd()

function error(message) {
  console.log('\x1b[31m%s\x1b[0m', message);
}
function hasReactNativeDependency() {
  try {
    const packageJson = JSON.parse(readFileSync(join(appRoot, 'package.json'), 'utf8'));
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    const hasReactNativeDependency = dependencies['react-native'] || devDependencies['react-native'];
    return hasReactNativeDependency;
  } catch (err) {
    error(
      'Could not parse package.json. make sure your terminal is at the root of your React Native project',
    );
    return false;
  }
}

if (!hasReactNativeDependency()) {
  error('This is not a React Native project');
  process.exit(1);
}

function rm(path) {
  try {
    rmSync(path, { recursive: true, force: true })
  } catch (e) {
    error(`Failed to delete ${path}, continuing..`)
  }
}

console.log(`clean-rn: Cleaning React Native caches for ${appRoot}..`)

// npm
rm(join(appRoot, 'node_modules'))

if(existsSync(join(appRoot, 'package-lock.json'))) {
  exec('npm cache clean --force')
  rm(join(appRoot, 'package-lock.json'))
} else if(existsSync(join(appRoot, 'yarn.lock'))) {
  exec('yarn cache clean')
  rm(join(appRoot, 'yarn.lock'))
} else if(existsSync(join(appRoot, 'pnpm-lock.yaml'))) {
  exec('pnpm store prune')
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


exec(join(appRoot, 'android', 'gradlew --stop')) // stop gradle daemon
rm(join(homedir(), '.gradle', 'caches'))
exec(join(appRoot, 'android', 'gradlew clean'))

// ios
const iosPaths=[
  'build',
  'Pods',
  'Podfile.lock',
  'DerivedData',
]
iosPaths.forEach((p) => rm(join(appRoot, 'ios', p)))
console.log('Cleaned everything! Run:\n  - yarn/npm i\n  - cd ios && pod repo update && pod update\n..to reinstall everything!')
