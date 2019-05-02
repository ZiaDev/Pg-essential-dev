module.exports = function() {

    return {
        db: {
            host: process.env.host,
            port: process.env.port,
            database: process.env.database,
            user: process.env.user,
            password: process.env.password,
            usessl: false
        }
    };

}