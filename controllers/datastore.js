exports.logStatus = ({ message, isError=false }) => {
    // TODO: - Pick a queryable datastore to use (GCP, AWS, etc)

    if (isError) {
        console.error(Date.now(), message)
    } else {
        console.log(Date.now(), message)
    }
}

exports.logEmail = ({ params, meta }) => {
    // console.log(params, meta)
    // TODO: - Pick a queryable datastore to use (GCP, AWS, etc)
}