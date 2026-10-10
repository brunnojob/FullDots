import { test } from 'vitest';
import assert from 'node:assert/strict';
import { originAllowed } from './origins.js';

test('only HTTP origins participate in exact or loopback equivalence', () => {
  assert.equal(
    originAllowed('http://localhost:3000', 'http://127.0.0.1:3000'),
    true,
  );
  assert.equal(
    originAllowed('https://example.com', 'https://example.com'),
    true,
  );
  for (const origin of [
    'null',
    'file:///',
    'data:text/plain,hello',
    'http://u:p@localhost:3000',
    'http://localhost:3000/path',
    'http://localhost:3000?q=1',
  ])
    assert.equal(originAllowed(origin, origin), false);
  assert.equal(
    originAllowed('http://localhost:3001', 'http://localhost:3000'),
    false,
  );
});
