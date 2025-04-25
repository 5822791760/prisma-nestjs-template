import { config } from 'dotenv';
import * as path from 'path';

// Initializing dotenv
function getEnvPath(nodeEnv: string | undefined) {
  if (nodeEnv === 'test') {
    return '../../../../../.env.test';
  }

  if (nodeEnv === 'cli') {
    return '../../../../.env';
  }

  return '../../../../.env';
}

const envPath: string = path.resolve(
  __dirname,
  getEnvPath(process.env.NODE_ENV),
);
config({ path: envPath });
