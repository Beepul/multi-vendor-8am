const express = require('express')
require("./db.config")
const mainRouter = require('./router.config')
const helmet = require('helmet')
const cors = require('cors')
const Joi = require('joi')
const morgan = require('morgan')

const app = express()

app.use(helmet())
app.use(cors())

// body parser
app.use(express.json()) 
app.use(express.urlencoded({
    extended: true
}))

app.use(morgan('dev'))

// static middleware
app.use('/assets', express.static('./public/'))


mainRouter.get('/health', (req, res, next) => {
    res.json({
        result: 'Hello There',
        message: "Success",
        meta: null
    })
})

app.use(mainRouter)


app.use((req,res,next) => {
    next({
        code: 404,
        message: 'Not Found'
    })
})


app.use((err, req, res, next) => {

    let statusCode = err.code || 500
    let data = err.data || null 
    let msg = err.message || 'Server Error'

    // console.log(err)

    if(err instanceof Joi.ValidationError){
        statusCode = 422
        msg = "Validation Failed"
        data = {}

        const errDetails = err.details

        if(Array.isArray(errDetails)){
            errDetails.map((errorObj) => {
                data[errorObj.context.label] = errorObj.message
            })
        }

    }

    // handle mongodb uniqueness issues
    if(statusCode === 11000){
        statusCode = 400 
        const fields = Object.keys(err.keyPattern) // returns keys of the object in an array eg. [ 'email', 'name' ]
        data = {} // initially data is null and we cannot add keys to the null data, so reinitialize with empty object

        fields.map((fieldname) => {
            data[fieldname] = fieldname+" should be unique"
        })

        msg = "Validation Failed"
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        console.log(err)
        statusCode = 400
        msg = 'Unexpected file format or limit reached'
        data = {}
    } 

    res.status(statusCode).json({
        result: data,
        message: msg,
        meta: null
    })
})

module.exports = app