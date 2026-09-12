import { expect, test } from '@playwright/test';

test(
  'booking service returns a booking list',
  { tag: '@smoke' },
  async ({ request }) => {
    const response = await request.get('/booking');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const responseBody: unknown = await response.json();

    expect(Array.isArray(responseBody)).toBe(true);
  },
);
