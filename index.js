require('dotenv').config()

const express = require('express')
const indexRouter = require('./routes/index')

const app = express()

app.use(express.json())
app.use('/', indexRouter)

const port = process.env.PORT || 8080

app.listen(port, () => {
    console.log(`Node server listening on port ${port}`)
})