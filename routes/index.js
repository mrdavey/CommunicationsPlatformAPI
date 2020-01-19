const express = require('express')
const router = express.Router()

const { precheckParams, sendEmail } = require("../controllers/email")
const { logStatus } = require("../controllers/datastore")

/**
 * Sends an email using the information included in the call
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

        try {
            let safeParams = precheckParams({ to, to_name, from, from_name, subject, body })
            await sendEmail(safeParams)
            return res.json({ success: true, message: "success" })
        } catch (e) {
            let errorMessage = e.message
            logStatus({ message: errorMessage, isError: true })
            return res.status(400).json({ success: false, message: errorMessage });
        }
    }
    return res.status(400).json({ success: false, message: "Invalid auth key"})
})

module.exports = router