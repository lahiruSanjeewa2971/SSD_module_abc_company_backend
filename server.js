require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const https = require('https')
const path = require('path')
const fs = require('fs')

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
    useTempFiles: true
}))
 
//Routes
app.use('/user', require('./routers/UserRouter'))
app.use('/formdata', require('./routers/FormDataRouter'))

const PORT = process.env.PORT || 5001 

/*app.listen(PORT, ()=>{
    console.log('Server is running on port', PORT)
})*/

//connect to mongodb
const URI = process.env.MONGODB_URL

const sslServer = https.createServer(
    {
        key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
    },
    app
)

mongoose
    .connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        sslServer.listen(PORT, () => console.log('Secure server'))
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        if(err) throw err;
        console.error(err.message)
    });

app.use('/', (req, res, next) => {
    res.send('ABC company API');
})