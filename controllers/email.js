const { cleanHTML, isValidEmail, isValidString } = require("../helpers/parseInput");

/**
 * Ensures that the required parameters are valid and cleans the HTML body
 * @param { {} } params The parameters received
 * @returns { {} } A dictionary of the cleaned parameters. On error, returns an error object with the reason
 */
exports.precheckParams = (params) => {
    let requiredParams = { 
        to: params.to, 
        to_name: params.to_name, 
        from: params.from, 
        from_name: params.from_name, 
        subject: params.subject, 
        body: params.body 
    };

    // Ensure we have the required parameters and they are all strings
    let missingParams = Object.keys(requiredParams).filter((key) => {
        if (!requiredParams[key] || !isValidString(requiredParams[key])) return key;
    })

    if (missingParams.length > 0) {
        throw Error(`Missing required parameters: ${missingParams.join(", ")}. They must be strings.`)
    }

    // Ensure the email addresses are valid
    if (requiredParams.to && !isValidEmail(requiredParams.to) || requiredParams.from && !isValidEmail(requiredParams.from)) {
		throw Error(`An email address is invalid. Emails addresses given: ${requiredParams.to}, ${requiredParams.from}`);
	}

    // Convert body HTML to plain text
    let cleanBody = cleanHTML(requiredParams.body);

    return { ...requiredParams, body: cleanBody }
}

exports.sendEmail = async (params) => {
    console.log(params)
}