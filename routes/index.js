const express = require('express')
const router = express.Router()
const basicAuth = require("express-basic-auth")

const { precheckParams, sendEmail } = require("../controllers/email")
const { logStatus } = require("../controllers/datastore")
const { processHook } = require("../controllers/webhooks")
const { Services } = require("../helpers/constants")

const webhookUserAuth = basicAuth({
	users: {
		webhook: process.env.WEBHOOK_AUTH,
	},
	challenge: false
})

/**
 * Sends an email using the information included in the call.
 * To send a HTML email, the body must include:
 *  {
 *    "isHTML": true,
 *    "htmlTags": ["a", "h1"] // Or any HTML tags to enable
 *  }
 * @returns { {} } A json response. On error, returns a 400 status response with associated error message
 */
router.post("/email", async (req, res) => {
    let auth = req.get("authKey")
    if (auth && auth === process.env.KEY_AUTH) {
        let to = req.body.to
        let to_name = req.body.to_name
        let from = req.body.from
        let from_name = req.body.from_name
        let subject = req.body.subject
        let body = req.body.body
        let enableHtmlEmail = req.body.isHTML ? req.body.isHTML : false
        let allowedHtmlTags = enableHtmlEmail ? req.body.htmlTags : []

        try {
            let safeParams = precheckParams({ to, to_name, from, from_name, subject, body }, enableHtmlEmail, allowedHtmlTags)
            await sendEmail(safeParams)
            return res.json({ success: true, message: "success" })
        } catch (e) {
            let errorMessage = e.message
            logStatus({ message: errorMessage, isError: true })
            return res.status(400).json({ success: false, message: errorMessage })
        }
    }
    return res.status(400).json({ success: false, message: "Invalid auth key"})
})

//
// Webhooks
//

router.post("/sgWebhook", webhookUserAuth, (req, res) => {
    let content = req.body
    try {
        processHook(Services.SENDGRID, content)
        return res.json({ success: true })
    } catch (e) {
        let errorMessage = e.message
        logStatus({ message: errorMessage, isError: true })
        return res.status(400).json({ success: false, message: errorMessage })
    }
})

router.post("/pmWebhook", webhookUserAuth, (req, res) => {
    let content = req.body
	try {
		processHook(Services.POSTMARK, content)
		return res.json({ success: true })
	} catch (e) {
		let errorMessage = e.message
		logStatus({ message: errorMessage, isError: true })
		return res.status(400).json({ success: false, message: errorMessage })
	}
})

module.exports = router