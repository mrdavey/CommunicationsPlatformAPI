const { makeFetchRequest } = require("../helpers/network/fetch")

const endpoint = "https://api.sendgrid.com/v3/"
const apiKey = process.env.KEY_API_SENDGRID

exports.sgSendEmail = async ({ to, to_name, from, from_name, subject, body }) => {
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
            type: "text/plain",
            value: body
        }]
    }

    let headers = {
		authorization: `Bearer ${apiKey}`
	}
    
    await makeFetchRequest(endpoint + "mail/send", fetchBody, headers).catch(e => {
        throw Error(`Sendgrid error: ${e.message}`)
    })
}