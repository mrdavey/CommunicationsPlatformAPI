# Communications Platform API
A simple REST API for reliable email sending and logging.

### Features
 - Validates and cleans input data from POST request
 - Initially uses SendGrid to send emails. If SendGrid fails, then falls back to PostMark
 - Automatic retries (customisable) with exponential backoff
 - Can be extended to keep a record of all emails passing through and all status logs. Requires the implementation of a datastore (See [datastore.js](/controllers/datastore.js))

### API Flow
![API Flow](/flow.png "API flow")

## To set up
1. Set up your `.env` variables (rename `env` file to `.env`)
    - Get API keys for [SendGrid](https://sendgrid.com/) and [PostMark](http://www.postmark.com) by creating free accounts.
        - If you have your own domain, then set up the relevant anti-spam settings (e.g. DKIM) to ensure your emails are received in the user's inbox
        - Alternatively, the receiver may need to check their spam folders for your emails
    - Create a `KEY_AUTH` key so only you can send emails
    - Customise `SETTING_DEFAULT_RETRIES` to the number of max retries for endpoint failures
2. Install dependencies and start the web service:
    ```
    npm install
    npm start
    ```
3. Make a POST request to the webservice, making sure to include the `authKey` header and value (needs to be the same as `KEY_AUTH` in `.env` file). 
    
    Example cURL:
    ```
    curl --location --request POST 'http://localhost:8080/email' \
    --header 'authKey: XXXXXXX' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "to": "david@truong.vc",
        "to_name": "Ms.Fake",
        "from": "noreply@truong.vc",
        "from_name": "David",
        "subject": "A Message from sendgrid",
        "body": "<h1>Your Bill</h1> <p>$20000</p>"
    }'
    ```

## To test
Ensure you've installed the dependencies, then in the terminal: `npm test`