export const {
    APP_PORT = 4000,
    NODE_ENV = 'development',
    DB = 'mongodb://localhost:27017/merng',
    // Session
    SESSION_NAME = 'sid',
    SESSION_SECRET = 'ssh!secret',
    SESSION_LIFETIME = 1000 * 60 * 60 * 2,
    // REDIS
    REDIS_PORT = 6379,
    REDIS_HOST = 'localhost',
    REDIS_PASSWORD = 'secret'
} = process.env

export const IN_PORD = NODE_ENV === 'production'