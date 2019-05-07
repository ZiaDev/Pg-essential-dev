const pool = require('./pool')

executeQuery = (method, query, params, tableName) => {
    return getPool().then((p) => {
        return p.getClient().then((connection) => {
            return connection.client[method](query, params, tableName).then((results) => {
                connection.done();
                return results;
            }).catch((err) => {
                connection.done();
                return Promise.reject(err);
            })
        });
    });
}

getPool = () => {
    let pl = new pool({
        host: global.config.db.host,
        port: global.config.db.port,
        database: global.config.db.database,
        user: global.config.db.user,
        password: global.config.db.password
    });
    return Promise.resolve(pl);
}

module.exports = class {
    static execute(query, params) {
        return executeQuery('execute', query, params);
    }

    static fetchOne(query, params) {
        return executeQuery('fetchOne', query, params);
    }

    static executeBulkInsertion(query, params, tableName) {
        return executeQuery('executeBulkInsertion', query, params, tableName);
    }

    static fetchAll(query, params) {
        return executeQuery('fetchAll', query, params);
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