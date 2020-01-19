const m = require('moment')

exports.logStatus = ({ message, isError=false }) => {
    // TODO: - Pick a queryable datastore to use (GCP, AWS, etc)

    if (isError) {
        console.error(m().format(), message)
    } else {
        console.log(m().format(), message)
    }
}

exports.logEmail = ({ params, meta }) => {
    // TODO: - Pick a queryable datastore to use (GCP, AWS, etc)
    // console.log(params, meta)
}

exports.logEvent = ({ email, timestamp, event, useragent, link, service }) => {
    // TODO: - Pick a queryable datastore to use (GCP, AWS, etc)
    console.log(`${service}: ${event} event${link ? ` (${link})` : ""} from ${email} @ timestamp: ${timestamp} with user agent: ${useragent}`)
}