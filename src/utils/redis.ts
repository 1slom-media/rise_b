import Redis from 'ioredis';

const redis = new Redis({
  port: 6379, // Redis port
  host: 'localhost', // Redis host
  password: 'Pm2dPkDE%rEF',
});


export default redis;