import dotenv from 'dotenv';
import { add } from './lobby/Lobby';
// load the environment variables from the .env file
dotenv.config({
  path: '.env',
});

console.log(process.env.APP_PORT);
console.log(add(1, 2));
