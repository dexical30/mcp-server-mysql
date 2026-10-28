import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { readPasswordFromOp } from '../../src/config/index.js';

describe('readPasswordFromOp', () => {
  let tmpDir: string;
  let fakeOp: string;
  let failingOp: string;

  beforeAll(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fake-op-'));

    // Echoes back its arguments so we can assert how `op` was invoked
    fakeOp = path.join(tmpDir, 'op');
    fs.writeFileSync(fakeOp, '#!/bin/sh\nprintf "secret-for:%s|%s|%s" "$1" "$2" "$3"\n', { mode: 0o755 });

    failingOp = path.join(tmpDir, 'op-fail');
    fs.writeFileSync(failingOp, '#!/bin/sh\necho "You are not currently signed in." >&2\nexit 1\n', { mode: 0o755 });
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should return stdout of `op read --no-newline <ref>`', () => {
    const result = readPasswordFromOp('op://Vault/staging db/password', fakeOp);

    expect(result).toBe('secret-for:read|--no-newline|op://Vault/staging db/password');
  });

  it('should reject references that do not start with op://', () => {
    expect(() => {
      readPasswordFromOp('Vault/item/password', fakeOp);
    }).toThrow('must start with op://');
  });

  it('should surface op stderr when op read fails', () => {
    expect(() => {
      readPasswordFromOp('op://Vault/item/password', failingOp);
    }).toThrow('You are not currently signed in.');
  });

  it('should throw a clear error when the op binary is missing', () => {
    expect(() => {
      readPasswordFromOp('op://Vault/item/password', path.join(tmpDir, 'does-not-exist'));
    }).toThrow('Failed to read MySQL password from 1Password');
  });
});
