const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

for (const [name, secretName, signer, marker] of [
  ['access', 'JWT_SECRET', 'sign', 'access-fixture-only'],
  ['refresh', 'REFRESH_JWT_SECRET', 'signRefresh', 'refresh-fixture-only'],
]) {
  test(`${name} tokens use the secret loaded from .env on first import`, (t) => {
    const fixture = fs.mkdtempSync(path.join(__dirname, '.jwt-env-'));
    t.after(() => fs.rmSync(fixture, { recursive: true, force: true }));
    fs.writeFileSync(path.join(fixture, '.env'),
      'JWT_SECRET=access-fixture-only\nREFRESH_JWT_SECRET=refresh-fixture-only\n');

    const env = Object.fromEntries(Object.entries(process.env).filter(([key]) =>
      !['JWT_SECRET', 'REFRESH_JWT_SECRET'].includes(key) &&
      !key.startsWith('DOTENV_CONFIG_')));
    const script = `
      const assert = require('node:assert/strict');
      const config = require(${JSON.stringify(path.resolve(__dirname, '../dist/config/jwt.js'))});
      const jwt = require(${JSON.stringify(require.resolve('jsonwebtoken'))});
      const expected = ${JSON.stringify(marker)};
      assert.ok(config[${JSON.stringify(secretName)}] === expected, 'secret must load before JWT configuration');
      const token = config[${JSON.stringify(signer)}]({ fixture: true });
      assert.ok(jwt.verify(token, expected).fixture, 'token must use the file-loaded secret');
    `;
    const result = spawnSync(process.execPath, ['-e', script], {
      cwd: fixture, env, encoding: 'utf8',
    });
    assert.ok(result.status === 0, result.stderr || 'JWT configuration child process failed');
  });
}
