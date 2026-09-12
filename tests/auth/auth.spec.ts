import { expect, test } from '@playwright/test';
import { AuthClient } from '../../clients/auth.client.js';
import type { AuthError, AuthToken } from '../../models/auth.types.js';
import { getAuthCredentials } from '../../utils/environment.js';

test.describe('Authentication API', () => {
  test(
    'valid credentials generate an authentication token',
    { tag: ['@auth', '@smoke'] },
    async ({ request }) => {
      const authClient = new AuthClient(request);
      const credentials = getAuthCredentials();

      const response = await authClient.createToken(credentials);

      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/json');

      const responseBody = (await response.json()) as AuthToken;

      expect(responseBody.token).toBeTruthy();
    },
  );
  test(
    'invalid credentials do not return an authentication token',
    { tag: ['@auth', '@negative'] },
    async ({ request }) => {
      const authClient = new AuthClient(request);
      const validCredentials = getAuthCredentials();

      const invalidCredentials = {
        ...validCredentials,
        password: 'incorrect-password',
      };

      const response = await authClient.createToken(invalidCredentials);

      expect(response.status()).toBe(200);

      const responseBody = (await response.json()) as AuthError;

      expect(responseBody.reason).toBe('Bad credentials');
      expect(responseBody).not.toHaveProperty('token');
    },
  );
});
