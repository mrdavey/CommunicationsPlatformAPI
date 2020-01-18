const { precheckParams, sendEmail } = require("./email")

let validFields = {
	to: "fake+test@df.com",
	to_name: "Ms.Fake",
	from: "noreply@uber.com",
	from_name: "David",
	subject: "A Message from Uber",
	body: "<h1>Your Bill</h1> <p>$10</p>"
}

test('all required parameters are supplied', () => {
    let missingParams = { ...validFields }
    delete missingParams.to_name
    expect(() => precheckParams(missingParams)).toThrow('Missing required parameters');
})

test('all required parameters are strings', () => {
    let nonStringParam = { ...validFields }
    nonStringParam.from_name = true
    expect(() => precheckParams(nonStringParam)).toThrow("Missing required parameters");
})

test('email address is valid', () => {
    let invalidEmail = { ...validFields }
    invalidEmail.from = "noreply@uber"
    expect(() => precheckParams(invalidEmail)).toThrow("email address is invalid");
})

test('html is cleaned', () => {
    let safeParams = precheckParams(validFields)
    expect(safeParams.body).toBe("Your Bill $10");
})

jest.mock("../services/sendGrid")
const { sgSendEmail } = require("../services/sendGrid")

jest.mock("../services/postMark")
const { pmSendEmail } = require("../services/postMark")

test('email is sent via Sendgrid, without PostMark', async () => {
    sgSendEmail.mockImplementation(() => {})
    pmSendEmail.mockImplementation(() => {})
    
    await sendEmail(validFields)

    expect(sgSendEmail).toHaveBeenCalled()
    expect(pmSendEmail).not.toHaveBeenCalled()
})

test('email is sent via PostMark when Sendgrid fails', async () => {
    sgSendEmail.mockImplementation(() => { throw Error("SendGrid mock error") })
    pmSendEmail.mockImplementation(async () => true)
    
    await sendEmail(validFields)

    expect(sgSendEmail).toHaveBeenCalled()
    expect(pmSendEmail).toHaveBeenCalled()
})