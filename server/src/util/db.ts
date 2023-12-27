import 'dotenv/config'
import mongoose from 'mongoose'
import env from './validateEnv'

const dbUrl:string=env.DB_URL || ''

const connectDB=async () => {
    try {
        // Once the promise is resolved the resolved value is contained in the data
        // variable we then access the host proprty of connection using the data
        await mongoose.connect(dbUrl).then((data:any)=>{
            console.log(`Mongoose Db Connected with ${data.connection.host}`)
        })
    } catch (error:any) {
        console.log(error.message)
        setTimeout(connectDB,5000)
    }
}

export default connectDB