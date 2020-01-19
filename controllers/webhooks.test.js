const { processHook } = require("./webhooks")
const { Services } = require("../helpers/constants")

const sgMock = require("./mocks/webhooks.sendgrid.mock.json")
const pmMockOpen = require("./mocks/webhooks.postmark.mock.open.json")
const pmMockClick = require("./mocks/webhooks.postmark.mock.click.json")

test('sendgrid mock data should return click and open events', () => {
    let proccessed = processHook(Services.SENDGRID, sgMock)
    expect(proccessed.length).toBe(2)
    expect(proccessed[0].event).toBe('open')
    expect(proccessed[0].service).toBe(Services.SENDGRID)
    expect(proccessed[1].event).toBe('click')
    expect(proccessed[1].service).toBe(Services.SENDGRID)
})

test('postmark mock data should return click and open events', () => {
    let processedOpen = processHook(Services.POSTMARK, pmMockOpen)
    expect(processedOpen.event).toBe('open')
    expect(processedOpen.service).toBe(Services.POSTMARK)
    
    let processedClick = processHook(Services.POSTMARK, pmMockClick)
    expect(processedClick.event).toBe("click")
    expect(processedClick.link).toBe("https://example.com")
    expect(processedClick.service).toBe(Services.POSTMARK)
})