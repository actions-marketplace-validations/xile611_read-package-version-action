import {getVersion} from './../src/getVersion'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'

test('getVersion by default', async () => {
  expect(getVersion()).toBe('2.0.0')
})

test('getVersion when input "path"', async () => {
  expect(getVersion('./')).toBe('2.0.0')
})

test('getVersion when input "path" and "filename"', async () => {
  expect(getVersion('./__tests__', 'test.json')).toBe('0.1.0')
})

test('getVersion input "path" and "filename" and "field"', async () => {
  expect(getVersion('./__tests__', 'test.json', 'another')).toBe('1.0.0')
})

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_PATH'] = '__tests__'
  process.env['INPUT_FILENAME'] = 'test.json'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }

  console.log(cp.execFileSync(np, [ip], options).toString())
})

test('test runs', () => {
  process.env['INPUT_SEMVER_STRING'] = '2.3.0'
  process.env['INPUT_USE_CURRENT_VERSION'] = 'false'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }

  console.log(cp.execFileSync(np, [ip], options).toString())
})
