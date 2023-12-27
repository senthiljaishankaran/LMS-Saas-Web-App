/*There are two methods to handle errors
1. Using createHttpError from express framework
    This approach is used when the size of the application is small scale
2. By Extending Error Class
    This is a Custom Error handling approach which is used when ever the 
    size of the application is medium to large scale
Note:
    Choosing the handling is completly depend upon the application and it's
    business logic
*/
class ErrorHandler extends Error{
    // Error class constructor by defalut does'nt have the status code property
    // we are creating a variable to assign it to the constructor
    statusCode:Number
    constructor(message:string,statusCode:Number){
        // super keyword is nothing but it refers to the constructor of the 
        // extended class as the error class has the message property it refers to it
        super(message)
        // this keyword refes to the current class which means 
        // this.statusCode refers to statusCode property we defined
        this.statusCode=statusCode

        // when explicitly requested, Node.js can capture a stack trace to provide 
        // information about where the error or specific point of interest in the 
        // code occurred
        Error.captureStackTrace(this,this.constructor)
    }
}

export default ErrorHandler