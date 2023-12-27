import 'dotenv/config'
import express, { NextFunction,Request,Response} from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import env from './util/validateEnv'

const app=express()

app.use(express.json({limit:"50mb"}))

app.use(cookieParser())

app.use(cors({
    origin:env.ORIGIN
}))

app.get("/test",(req:Request,res:Response,next:NextFunction)=>{
    res.status(200).json({
        success:true,
        message:"API Test Successful"
    })

app.all("*",(req:Request,res:Response,next:NextFunction)=>{
    const err=new Error(`Route ${req.originalUrl} not found`) as any
    err.statusCode=404
    next(err)
})

})

export default app