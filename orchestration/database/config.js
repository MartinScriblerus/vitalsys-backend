let config

if (process.env.NODE_ENV === 'production'){
    config = {
        db: process.env.DB_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST
    }
}else{
    config = {
        db: 'Alt_SXSW_db',
        username: 'root',
        password: 'test1234',
        host: '127.0.0.1'
    }
}

module.exports = config