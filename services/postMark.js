const { makeFetchRequest } = require("../helpers/network/fetch")

const endpoint = "https://api.postmarkapp.com/email"
const apiKey = process.env.KEY_API_POSTMARK

exports.pmSendEmail = async ({ to, to_name, from, from_name, subject, body }) => {
    let fetchBody = {
        From: `${from_name} ${from}`,
        To: `${to_name} ${to}`,
        Subject: subject,
        TextBody: body
    }

    let headers = {
		"X-Postmark-Server-Token": apiKey,
		Accept: "application/json"
	}

	await makeFetchRequest(endpoint, fetchBody, headers).catch((e) => {
		throw Error(e.message)
    })
}