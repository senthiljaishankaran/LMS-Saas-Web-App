import app from "./app"
import env from './util/validateEnv'

const port=env.PORT

app.listen(port,()=>{
    console.log(`server is listening in port ${port}`)
})

