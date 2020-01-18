const retry = require("async-retry");

/**
 * @param fn The function to async retry
 * @param endpoint The endpoint for debugging purposes
 * @param retries The number of times to retry the endpoint. Default = 3
 */
exports.retry = async (fn, endpoint, retries=3) => {
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