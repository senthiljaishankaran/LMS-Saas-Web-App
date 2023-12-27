import 'dotenv/config'
import env from './validateEnv'
import { Redis } from 'ioredis'

const redisClient=()=>{
    if(env.REDIS_URL){
        console.log('Redis Connected')
        return env.REDIS_URL
    }
    throw new Error('Redis Connection failed')
}

export const redis=new Redis(redisClient())