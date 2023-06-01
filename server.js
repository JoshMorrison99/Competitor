const express = require('express')
const mongoose = require('mongoose')

const port = 5000
const app = express()

mongoose.connect("mongodb://127.0.0.1:27017/mydatabase", { useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log("Connected to MongoDB"))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})