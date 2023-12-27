import { cleanEnv } from 'envalid'
import { port,url } from 'envalid/dist/validators'

export default cleanEnv(process.env,{
    PORT:port(),
    ORIGIN:url(),
    DB_URL:url(),
    REDIS_URL:url()
})