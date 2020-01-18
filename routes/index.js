const express = require('express')
const router = express.Router()

router.post("/email", async (req, res) => {
    let auth = req.get("authKey")
    if (auth && auth === process.env.KEY_AUTH) {
        return res.json({ success: true })
    }
    return res.status(400).json({ success: false, message: "Not valid auth"})
})

module.exports = router