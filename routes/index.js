const express = require('express')
const router = express.Router()

const { sendEmail } = require("../controllers/emailController")
const { cleanHTML, isValidEmail, isValidString } = require("../helpers/parseInput")

/**
 * Sends an email using the information included in the call
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

        // Ensure we have the required parameters and they are all strings
        let requiredParams = {to: to, to_name: to_name, from: from, from_name: from_name, subject: subject, body: body}

        let missingParams = Object.keys(requiredParams).filter(key => {
            if (!requiredParams[key] || !isValidString(requiredParams[key])) return key
        })

        if (missingParams.length > 0) {
            return res.json({ success: false, message: `Missing required parameters: ${missingParams.join(", ")}. They must be strings.` })
        }

        // Ensure the email addresses are valid
        if (!isValidEmail(to) || !isValidEmail(from)) {
            return res.json({ success: false, message: `An email address is invalid. Emails addresses: ${to}, ${from}`})
        }

        // Convert body HTML to plain text
        let cleanBody = cleanHTML(body)

        // Send email
        await sendEmail({ ...requiredParams, body: cleanBody }).catch(e => {
            return res.json({ success: false, message: `An error occured when trying to send email: ${e.message}` });
        })

        return res.json({ success: true, message: "success" })
    }
    return res.status(400).json({ success: false, message: "Invalid auth key"})
})

module.exports = router