const StatusCodes=require('http-status-codes')
const CustomApiError=require('./custom-api')
const { notFoundMiddleware } = require('../Middlewares/not-found')

class NotFoundError extends CustomApiError{
    constructor (message){
        super(message)
        this.StatusCodes=StatusCodes.BAD_REQUEST
    }
}
module.exports=notFoundMiddleware