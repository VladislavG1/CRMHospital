import * as dotenv from 'dotenv'; 

dotenv.config();
import { join } from 'path';

export default ()=> ({
   
    NULL_HOST: process.env.NULL_HOST,
    PORT: process.env.PORT,

    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_USER: process.env.REDIS_USER,
    REDIS_USER_PASSWORD: process.env.REDIS_USER_PASSWORD,
    
})