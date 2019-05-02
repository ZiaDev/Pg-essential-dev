const pool = require('./pool')

module.exports = class {

    static getPool() {
               let pl = new pool({
                    host: global.config.db.host,
                    port: global.config.db.port,
                    database: global.config.db.database,
                    user: global.config.db.user,
                    password: global.config.db.password
                });
                return Promise.resolve(pl);
        }

    
        static execute( query, params) {
            return this.getPool().then((p) => {
                return p.getClient().then((connection) => {
                    return new Promise((resolve, reject) => {
                        connection.client.execute(query, params, (err, results) => {
                            if (err) {
                                connection.done();
                                reject(err);
                            } else {
                                connection.done();
                                resolve(results);
                            }
                        });
                    });
                });
            });
        }


        static fetchOne(query, params) {
            return this.getPool().then((p) => {
                return p.getClient().then((connection) => {
                    return new Promise((resolve, reject) => {
                        connection.client.fetchOne(query, params).then((results)=>{
                            connection.done();
                            resolve(results);
                        }).catch((err)=>{
                            connection.done();
                            reject(err);
                        })
                        });
                    });
                });
            }

    
        static executeWithResult(query, params) {
            return this.getPool().then((p) => {
                return p.getClient().then((connection) => {
                    return new Promise((resolve, reject) => {
                        connection.client.executeWithResult(query, params, (err, results) => {
                            if (err) {
                                connection.done();
                                reject(err);
                            } else {
                                connection.done();
                                resolve(results);
                            }
                        });
                    });
                });
            });
        }


    



    }
