const { sgProcessWebhook } = require('../services/sendGrid')
const { pmProcessWebhook } = require('../services/postMark')
const { logEvent } = require("../controllers/datastore")
const { Services } = require("../helpers/constants")

exports.processHook = (service, content) => {
    switch (service) {
        case Services.SENDGRID:
            let sgProcessed = sgProcessWebhook(content)
            sgProcessed.map((event) => logEvent({ ...event }))
            return sgProcessed
        case Services.POSTMARK:
            let pmEntry = pmProcessWebhook(content)
            logEvent({ ...pmEntry })
            return pmEntry
        default:
            throw Error(`Unable to process webhook. Service (${service}) is invalid!`)
    }
}