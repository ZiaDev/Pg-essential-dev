'use strict';

const pg = require('pg'),
    spice = require('pg-spice'),
    essential = require('../../index.js');

spice.patch(pg);
essential.patch(pg);

module.exports = class {
    constructor(database) {
        this.database = database;
        this.config = {
            host: database.host,
            port: database.port,
            database: database.database,
            user: database.user,
            password: database.password,
            max: 10,
            idleTimeoutMillis: 10000,
            ssl: global.config.db.usessl
        };
        // console.log(this.config)
        this.pool = new pg.Pool(this.config);
        this.pool.on('error', err => {
            console.log('Error in pool');
           
        });
    }

    getClient() {
        return new Promise((resolve, reject) => {
            this.pool.connect(function (err, client, done) {
                if (err) {
                    console.log(err)
                    done();
                    reject(err);
                } else {
                    resolve({
                        client,
                        done
                    });
                }
            });
        });
    }
};