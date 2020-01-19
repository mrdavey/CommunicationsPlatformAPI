const m = require("moment")
const { makeFetchRequest } = require("../helpers/network/fetch")
const { Services } = require("../helpers/constants")

const endpoint = "https://api.postmarkapp.com/email"
const apiKey = process.env.KEY_API_POSTMARK

exports.pmSendEmail = async ({ to, to_name, from, from_name, subject, body, isHTML = false }) => {
	let fetchBody = {
		From: `${from_name} ${from}`,
		To: `${to_name} ${to}`,
		Subject: subject,
		TrackOpens: true,
		TrackLinks: isHTML ? "HtmlAndText" : "TextOnly"
	}
	
	if (isHTML) {
		fetchBody.HtmlBody = body
	} else {
		fetchBody.TextBody = body
	}

	let headers = {
		"X-Postmark-Server-Token": apiKey,
		Accept: "application/json"
	}

	await makeFetchRequest(endpoint, fetchBody, headers).catch((e) => {
		throw Error(e.message)
	})
}

/**
 * Process the event notification from the Postmark webhook.
 * @param { {} } o POST data object (Postmark POSTs data for each event)
 * @returns { {} } The processed event 
 */
exports.pmProcessWebhook = (o) => {
  let eventType = o.RecordType
  if (eventType === "Open" || eventType === "Click") {
		let usefulInfo = {
			email: o.Recipient,
			timestamp: m(o.ReceivedAt, "YYYY-MM-DDTHH:mm:ss.SSSSSSSZ").format(),
			event: eventType.toLowerCase(),
			useragent: o.UserAgent,
			service: Services.POSTMARK
		}

		if (eventType === "Click") {
			usefulInfo.link = o.OriginalLink
		}

		return usefulInfo
  }
  return null
}