import { cleanEnv } from 'envalid'
import { port,url,str } from 'envalid/dist/validators'

export default cleanEnv(process.env,{
    PORT:port(),
    ORIGIN:url(),
    DB_URL:url(),
    REDIS_URL:url(),
    ACTIVATION_SECRET:str()
})