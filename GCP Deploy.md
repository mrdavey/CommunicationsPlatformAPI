## To deploy on GCP
1. Ensure `.env`, webhooks, and tracking is setup as per instructions in `README.MD`.
2. Create a GCP project with billing enabled
3. Create a new application on [App Engine](https://console.cloud.google.com/appengine)
    - Select `Node.js` for Language and `Standard` for the Environment
4. Follow the instructions to install the Cloud SDK
5. Make note of your project's ID (e.g. abcde-34f42)
6. Deploy your app with the command:
    ```
    gcloud app deploy --project YOUR_PROJECT_ID app.yaml
    ```