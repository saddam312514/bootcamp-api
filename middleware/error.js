const ErrorResponse = require('../utils/errorResponse')
const errorHandler = (err,req,res,next) => {
    let error = {...err}
    error.message = err.message
    console.log(err)

    // mongose bad objectId
    if(err.name === 'CastError'){
        const message = `Resourse not found with id of ${err.value}`
        error = new ErrorResponse(message,404)
    }
    // Mongose duplicate Key
    if(err.code === 11000){
        const message = 'Duplicated field value Entered'
        error = new ErrorResponse(message,400)
    }
    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(val => val.message)
        error = new ErrorResponse(message,400)
    }
    res.status(error.statusCode || 500 ).json({
        success: false,
        error: error.message || 'Server Error'
    })
}
module.exports = errorHandler