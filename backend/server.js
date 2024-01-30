require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const negotiationRoutes = require('./routes/negotiationEndpoints')

const app = express()

//middleware
app.use(express.json())

app.use((req,res,next) =>{
    console.log(req.path,req.method)
    next()
})

//routes
app.use('/api/negotiation',negotiationRoutes)


//mongodb
mongoose.connect(process.env.MONG_URI)
    .then(() =>{
        app.listen(process.env.PORT, () =>{
            console.log("Server listening on port ",process.env.PORT)
        })
    })
    .catch((error) =>{
        console.log(error)
    })

