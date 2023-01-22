import { jest } from "@jest/globals";
import process from 'node:process';
import cp from 'node:child_process';
import path from 'node:path';
import { determineIp } from "./src/ip.mjs";

test.skip('determines ip', async () => {
  expect(await determineIp()).toBe('192.168.1.1');
});

// I need to implement this properly with mocks and everything
test.skip('test runs', () => {
  process.env['INPUT_MILLISECONDS'] = 100;
  const action = path.join(__dirname, 'index.mjs');
  const result = cp.execSync(`node ${action}`, {env: process.env}).toString();
  console.log(result);
});
