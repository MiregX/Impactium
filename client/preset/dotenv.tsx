import path from 'path';
import dotenv from 'dotenv';
import { loadEnvConfig } from '@next/env';
import fs from 'fs';

export const loadEnv = async (mode) => {
  process.env.IS_DEV = mode !== 'production'
    ? 'true'
    : '';
  
  const projectDir = process.cwd();
  const env = path.join(
    projectDir,
    process.env.IS_DEV
      ? '.development.env'
      : '.production.env'
  );
  loadEnvConfig(env);
  dotenv.config(fs.existsSync(env) ? { path: env } : null);
};