const retry = require("async-retry");

/**
 * @param fn The function to async retry
 * @param endpoint The endpoint for debugging purposes
 * @param retries The number of times to retry the endpoint. Default = proccess.env.SETTING_DEFAULT_RETRIES
 */
exports.retry = async (fn, endpoint, retries = process.env.SETTING_DEFAULT_RETRIES) => {
	return await retry(
		async () => {
			return await fn()
		},
		{
			retries: retries,
			onRetry: async (e, attempt) => {
				console.log(`Retrying ${endpoint}, re-attempt: ${attempt}. Error reason: ${e.message}`)
			}
		}
	)
}