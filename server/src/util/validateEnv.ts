import { cleanEnv } from 'envalid'
import { port,url,str,email } from 'envalid/dist/validators'

export default cleanEnv(process.env,{
    PORT:port(),
    ORIGIN:url(),
    DB_URL:url(),
    REDIS_URL:url(),
    ACTIVATION_SECRET:str(),
    SMTP_HOST:str(),
    SMTP_PORT:port(),
    SMTP_MAIL:email(),
    SMTP_PASSWORD:str(),
    SMTP_SERVICE:str(),
})