import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../util/ErrorHandler";

const ErrorMiddleware=(err:any,req:Request,res:Response,next:NextFunction)=>{
    err.statusCode=err.statusCode || 500
    err.message=err.message || 'Internal Server Error'

    // Cast Error in Node js refers to mongo db ie.. error caused
    // during the data conversion of the objects
    if(err.name === 'CastError'){
        const message=`Resource Not Found.Invalid ${err.path}`
        err=new ErrorHandler(message,400)
    }
    
    // Duplicate key error (this is also associated with mongo db)
    if(err.code === 11000){
        const message=`Duplicate ${Object.keys(err.keyValue)} entered`
        err=new ErrorHandler(message,400)
    }
    
    // invalid jsonwebtoken
    if(err.name === 'JsonWebTokenError'){
        const message=`Json web token is invalid,try another`
        err=new ErrorHandler(message,400)
    }

    // Expired jsonwebtoken
    if(err.name === 'TokenExpiredError'){
        const message=`Json web token Expired`
        err=new ErrorHandler(message,400)
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message,
    })
}