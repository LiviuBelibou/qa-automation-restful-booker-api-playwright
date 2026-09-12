import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { AuthCredentials } from '../models/auth.types.js';

export class AuthClient {
  constructor(private readonly request: APIRequestContext) {}

  async createToken(credentials: AuthCredentials): Promise<APIResponse> {
    return this.request.post('/auth', {
      data: credentials,
    });
  }
}
