/** npm public-entry contract tests; deliberately do NOT import ../lib/client.js directly. */
import { strict as assert } from 'node:assert'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const manifestSource = readFileSync(join(root, 'package.json'), 'utf8')
const pkg = JSON.parse(manifestSource)
const require = createRequire(import.meta.url)

test('exports: raw package.json has no repeated subpath keys', () => {
  // JSON.parse silently overwrites duplicates, so inspect the raw text too.
  const keys = [...manifestSource.matchAll(/^\s*"(\.|\.\/[^"]+)"\s*:/gm)].map((m) => m[1])
  const duplicates = keys.filter((key, index) => keys.indexOf(key) !== index)
  assert.deepEqual(duplicates, [], `duplicate export keys: ${duplicates.join(', ')}`)
})

test('exports: ./client is the DSH browser bundle', () => {
  assert.equal(pkg.exports['./client'], './client/client.js')
  const resolved = require.resolve(`${pkg.name}/client`)
  assert.equal(resolved, join(root, 'client/client.js'))
  assert.match(readFileSync(resolved, 'utf8'), /window\.__ModuleLoader__\.load\s*\(/)
})

test('exports: ./a2a-client resolves and imports the Node A2A client API', async () => {
  assert.deepEqual(pkg.exports['./a2a-client'], {
    types: './lib/client.d.ts',
    default: './lib/client.js',
  })
  assert.ok(existsSync(join(root, 'lib/client.d.ts')), 'published TypeScript declaration is missing')
  const resolved = require.resolve(`${pkg.name}/a2a-client`)
  assert.equal(resolved, join(root, 'lib/client.js'))

  const sdk = await import(`${pkg.name}/a2a-client`)
  assert.equal(typeof sdk.A2aClient, 'function')
  assert.equal(typeof sdk.A2aRpcError, 'function')
  assert.equal(typeof sdk.matchesAllowlist, 'function')
})
