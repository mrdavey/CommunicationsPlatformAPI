const m = require('moment')
const { makeFetchRequest } = require("../helpers/network/fetch")
const { Services } = require("../helpers/constants")

const endpoint = "https://api.sendgrid.com/v3/"
const apiKey = process.env.KEY_API_SENDGRID

/**
 * Sends email via Sendgrid API.
 * More info: https://sendgrid.api-docs.io/v3.0/mail-send
 */
exports.sgSendEmail = async ({ to, to_name, from, from_name, subject, body, isHTML = false }) => {
    let fetchBody = {
		personalizations: [
			{
				to: [
					{
						email: to,
						name: to_name
					}
				],
				subject: subject
			}
		],
		from: {
			email: from,
			name: from_name
		},
		reply_to: {
			email: from,
			name: from_name
        },
        content: [ {
            type: isHTML ? "text/html" : "text/plain",
            value: body
		}],
		click_tracking: {
			enable: true,
			enable_text: true
		},
		open_tracking: {
			enable: true
		}
    }

    let headers = {
		authorization: `Bearer ${apiKey}`
	}
    
    await makeFetchRequest(endpoint + "mail/send", fetchBody, headers).catch(e => {
        throw Error(`Sendgrid error: ${e.message}`)
    })
}

/**
 * Process the event notification from the Sendgrid webhook.
 * @param { [ {} ] } o An array of events
 * @returns { [] } An array of `open` and `click` events
 */
exports.sgProcessWebhook = (o) => {
	let proccessed = []

	o.filter(object => {
		let usefulDetails = {
			email: object.email,
			timestamp: m.unix(object.timestamp).format(),
			event: object.event,
			useragent: object.useragent,
			service: Services.SENDGRID
		}
		
		if (object.event === 'open') {
			proccessed.push(usefulDetails)
		} else if (object.event === 'click') {
			usefulDetails.link = object.url
			proccessed.push(usefulDetails)
		}
	})
	return proccessed
}