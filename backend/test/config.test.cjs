const assert = require('node:assert/strict');
const test = require('node:test');

process.env.DB_HOST = '127.0.0.1';
process.env.DB_PORT = '3307';
process.env.DB_USER = 'cleanup_test';
process.env.DB_PASSWORD = 'test-only';
process.env.DB_NAME = 'cleanup_test';

test('both database entry points share the environment-configured pool', () => {
  const { db } = require('../dist/db.js');
  const { pool } = require('../dist/config/database/databaseConnectionPool.js');
  assert.ok(db === pool, 'database entry points must use the same pool');
  const config = db.pool.config.connectionConfig;
  for (const [option, value] of Object.entries({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })) {
    assert.ok(config[option] === value, `${option} must come from the environment`);
  }
});

test('compiled Swagger loads its YAML specifications', () => {
  const { swaggerSpec } = require('../dist/swagger/swagger.js');
  assert.ok(Object.keys(swaggerSpec.paths).length > 0);
});
