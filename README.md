# Communications Platform API
A simple REST API for reliable email sending and logging.

### Features
 - Validates and cleans input data from POST request
 - Initially uses SendGrid to send emails. If SendGrid fails, then falls back to PostMark
 - Automatic retries (customisable) with exponential backoff
 - Can handle Sendgrid and Postmark open/click webhooks
 - Can be extended to keep a record of all emails passing through, all status logs, and all open/click events from emails. Requires the implementation of a datastore (See [datastore.js](/controllers/datastore.js))

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

### Webhooks and tracking

#### To enable HTML link tracking
1. When making a POST request to the `/email` endpoint, include in the JSON body:
    ```
    "isHTML": true,
    "htmlTags": ["a"]
    ```

2. Follow the instructions below to enable Webhooks and tracking.

#### Sendgrid
1. In your Sendgrid [mail settings](https://app.sendgrid.com/settings/mail_settings), enable `Event Notifications` and select the relevant 'Open' and 'Click' events.
2. Deploy your web service and enter the `/sgWebhook` endpoint in the `HTTP POST URL` section. This should be a HTTPS endpoint.
    - Be sure to include the basic authentication details in your `.env` file under `WEBHOOK_AUTH`
        - e.g.  `https://webhook:password123@YOUR_WEB_SERVICE.COM/sgWebhook`
3. Save the settings in Sendgrid
4. Ensure the appropriate `click_tracking` and `open_tracking` values are set in the [sendGrid.js](/services/sendGrid.js) file.

#### Postmark
1. In your Postmark servers settings, enable `Webhooks` by selecting 'Add Webhook'.
2. Deploy your web service and enter the `/pmWebhook` endpoint in the `Webhook URL` section. This should be a HTTPS endpoint.
    - Be sure to include the basic authentication details in your `.env` file under `WEBHOOK_AUTH`
        - e.g.  `https://webhook:password123@YOUR_WEB_SERVICE.COM/pmWebhook`
3. Select the relevant 'Open' and 'Link Click' events.
4. Save the webhook.
4. Ensure the appropriate `TrackOpens` and `TrackLinks` values are set in the [postMark.js](/services/postMark.js) file.


### HTML emails
When making a POST request to the `/email` endpoint, include in the JSON body:
```
"isHTML": true,
"htmlTags": ["a", "h1"] // Or any HTML tags to enable
```

## To test
Ensure you've installed the dependencies, then in the terminal: `npm test`

## To do
 - Implement a datastore (GCP or AWS) to make emails, status logs, and open/click events queryable
 - When datastore is implemented, add metadata (Sendgrid = `custom_args`, Postmark = `Metadata`) to each email sent with a UID. This will enable each click/open event to be associated with a specific logged email.
 - Enable scheduling of emails based on timezones.