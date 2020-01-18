const fetch = require("node-fetch")
const { retry } = require("./retry")

/**
 * Makes a request to the desired endpoint, with automatic exponential backoff retries (default=3 retries)
 * @param {String} url The endpoint to fetch
 * @param {{}} bodyData Optional. The body, as a Dictionary object
 * @param {{}} headers The headers to include. Note: `Content-Type JSON` is already included.
 * @param {String} method Optional. The method, i.e. `DELETE`
 * @returns { Object } If successful, returns JSON result as object
 * @returns { Error } If there is an error, an Error object will be returned
 */
exports.makeFetchRequest = async (url, bodyData, headers, method) => {
	return await retry(async () => await makeRequest(url, bodyData, headers, method), `${url}`).catch((e) => {
		throw e
	})
}

async function makeRequest(url, body, headers, method) {
	let fetchOptions = {};

	if (headers) {
		let newHeaders = {
			"Content-Type": "application/json",
			...headers
        }
        
		if (body) {
			fetchOptions = {
				method: "POST",
				body: JSON.stringify(body),
				headers: newHeaders
			}
		} else {
			fetchOptions = {
				method: method ? method : "GET",
				headers: newHeaders
			}
		}
	} else {
		fetchOptions = {
			method: "GET"
		}
	}

	let response = await fetch(url, fetchOptions).catch((e) => {
		throw e
	})

	let status = response.status
	let statusText = response.statusText

	if (!(status >= 200 && status < 300)) {
		let message = `Fetch error: ${status}: ${statusText}`

		let responseBody = await response.json().catch((e) => { message += `, No json body returned`})
		if (responseBody) {
			message += `, responseBody: ${JSON.stringify(responseBody)}`
		}
		let error = Error(message)
		throw error
	}

	let result = await response.json().catch((e) => {
		// No JSON response body returned, which can be normal for some cases
		// console.log("OK to ignore: JSON parsing error:", e.message, ", continuing...");
		return
    })
    
	return result
}