import path from 'path';
import dotenv from 'dotenv';
import { loadEnvConfig } from '@next/env';
import fs from 'fs';

export const loadEnv = async (mode) => {
  process.env.IS_DEV = mode !== 'production'
    ? 'true'
    : '';
  
  const projectDir = process.cwd();
  loadEnvConfig(projectDir);
  
  const env = path.join(
    projectDir,
    '..',
    process.env.IS_DEV
      ? '.env.dev'
      : '.env.prod'
    );
  dotenv.config(fs.existsSync(env) ? { path: env } : null);
};