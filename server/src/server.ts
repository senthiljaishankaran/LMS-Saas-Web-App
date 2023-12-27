import app from "./app"
import connectDB from "./util/db"
import env from './util/validateEnv'

const port=env.PORT

app.listen(port,()=>{
    console.log(`server is listening in port ${port}`)
    connectDB()
})

