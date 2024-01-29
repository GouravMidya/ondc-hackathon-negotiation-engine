require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const negotiationRoutes = require('./routes/negotiationEndpoints')

const app = express()

//middleware
app.use(express.json())

app.use((req,res,next) =>{
    console.log(req.path,req.method)
})

//routes
app.use('/api/negotiation',negotiationRoutes)

app.listen(process.env.PORT, () =>{
    console.log("Server listening on port ",process.env.PORT)
})