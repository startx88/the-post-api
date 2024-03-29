const path = require('path')
const express = require('express')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose')
const Config = require('./Config/db')

// Apps 
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
// Cors Policy
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    next();
})

const postRouter = require('./routes/post');
const authRouter = require('./routes/auth')
app.use('/api/post', postRouter)
app.use('/api/user', authRouter)

/**
 * Errors
 */

app.use((req, res, next) => {
    const error = new Error("Page not found!");
    error.statusCode = 404;
    next(error)
});

app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        errors: {
            message: error.message,
            status: error.statusCode
        }
    })
})



// Database connection
mongoose.connect(Config.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        app.listen(PORT, () => {
            console.log('Database and server is running...')
        })
    }).catch(err => {
        console.log("Database is not connected!", err)
    });
