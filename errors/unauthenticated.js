const StatusCodes=require('http-status-codes')

const CustomApiError=require('./custom-api')

class UnauthenticatedError extends CustomApiError {
    constructor(message){
        super(message)
        this.StatusCodes=StatusCodes.BAD_REQUEST
    }
}
module.exports=UnauthenticatedError