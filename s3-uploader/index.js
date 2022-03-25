require('dotenv').config()
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const res = require('express/lib/response')
const routers = require('./routes')

app.use(express.json())

const PORT = process.env.PORT || 5000

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(expressLayouts)
app.use(express.static(__dirname + '/public'))

app.use('/', routers)

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})