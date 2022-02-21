// import des modules
const express = require('express')
const cors = require('cors')
const path = require('path');
const mongoose = require('mongoose')
const checkTokenMiddleware = require('./jsonwebtoken/check')

// import de connexion a la DB
// let DB = require('./db.config')

//initialisation API
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//import des modules de routage

const sauce_router = require('./routes/sauces')

const auth_router = require('./routes/auth')

//mise en place routage


app.use('/api/sauces',checkTokenMiddleware, sauce_router)

app.use('/api/auth', auth_router)

app.use('/images', express.static(path.join(__dirname, 'images'))); // Gestion des images

mongoose.connect(process.env.DBCONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    app.listen(process.env.SERVER_PORT, () => {
        console.log(`server is runnning on ${process.env.SERVER_PORT} bro`);
    })
})
.catch(err => console.log('DB error', err))

