import 'dotenv/config'
import { MESSAGES } from './shared/constants/messages'

const REQUIRED_ENV_VARS = [
	'DATABASE_URL',
	'FRONTEND_URL',
] as const

const checkEnv = (): void => {
	const missing = REQUIRED_ENV_VARS.filter((key,) => !process.env[key],)

	if (missing.length > 0) {
		throw new Error(MESSAGES.ERROR.MISSING_ENV_VARS([...missing,],),)
	}
}

export default checkEnv
