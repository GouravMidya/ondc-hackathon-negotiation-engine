//sensitive info hiding
require('dotenv').config()

//framework and database operations
const express = require('express')
const mongoose = require('mongoose')

//to handle requests to server
const negotiationRoutes = require('./routes/negotiationEndpoints')
const userRoutes = require('./routes/userEndpoints')

//express app
const app = express()

//middleware
app.use(express.json())

app.use((req,res,next) =>{
    console.log(req.path,req.method)
    next()
})

//routes
app.use('/api/negotiation',negotiationRoutes)
app.use('/api/users',userRoutes)

//mongodb
mongoose.connect(process.env.MONG_URI)
    .then(() =>{
        app.listen(process.env.PORT, () =>{
            console.log("Server listening on port ",process.env.PORT)
        })
    })
    .catch((error) =>{
        console.log(error.message)
    })

