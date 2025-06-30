import dotenv from 'dotenv'
import { validateEnv as validateEnvFn } from '@/config/envValidator'

const envFile = process.env.ENV_FILE || '.env'
dotenv.config({ path: envFile })

export const env = validateEnvFn()