//sensitive info hiding
require('dotenv').config()

const path = require('path');

//framework and database operations
const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose')

//to handle requests to server
const negotiationRoutes = require('./routes/negotiationEndpoints')
const userRoutes = require('./routes/userEndpoints')
const catalogueRoutes = require('./routes/catalogueEndpoints');

//express app
const app = express()

// Apply the cors middleware
app.use(cors());

//middleware
app.use(express.json())

app.use((req,res,next) =>{
    console.log(req.path,req.method)
    next()
})

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

//routes
app.use('/api/negotiation',negotiationRoutes)
app.use('/api/users',userRoutes)
app.use('/api/catalogue', catalogueRoutes);

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

