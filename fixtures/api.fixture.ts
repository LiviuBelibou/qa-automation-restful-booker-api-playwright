import { test as base, expect } from '@playwright/test';
import { AuthClient } from '../clients/auth.client.js';
import { BookingClient } from '../clients/booking.client.js';
import type { AuthToken } from '../models/auth.types.js';
import { getAuthCredentials } from '../utils/environment.js';

interface ApiFixtures {
  authClient: AuthClient;
  bookingClient: BookingClient;
  authToken: string;
}

export const test = base.extend<ApiFixtures>({
  authClient: async ({ request }, use) => {
    await use(new AuthClient(request));
  },

  bookingClient: async ({ request }, use) => {
    await use(new BookingClient(request));
  },

  authToken: async ({ authClient }, use) => {
    const response = await authClient.createToken(getAuthCredentials());

    if (response.status() !== 200) {
      throw new Error(
        `Authentication failed with status ${response.status()}.`,
      );
    }

    const responseBody = (await response.json()) as AuthToken;

    if (!responseBody.token) {
      throw new Error('Authentication response did not contain a token.');
    }

    await use(responseBody.token);
  },
});

export { expect };
