import type { AuthCredentials } from '../models/auth.types.js';

function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is missing. Check your .env file.`);
  }

  return value;
}

export function getAuthCredentials(): AuthCredentials {
  return {
    username: getRequiredEnvironmentVariable('API_USERNAME'),
    password: getRequiredEnvironmentVariable('API_PASSWORD'),
  };
}
