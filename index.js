let pgp = require('pg-promise')({
        capSQL: true
    }),
    spice = require('pg-spice');

function patch(pg, options) {
    spice.patch(pg, options);
    pg.Client.prototype.executeQuery = (client, config, values) => {

        let origQuery = pg.Client.prototype.query;
        return new Promise((resolve, reject) => {
            return origQuery.apply(client, [
                config,
                values,
                (e, r) => {
                    if (e) {
                        return reject(e);
                    } else {
                        return resolve(r);
                    }
                }
            ]);
        });
    }


    pg.Client.prototype.fetchOne = function(config, values) {
        let client = this;
        return this.executeQuery(client, config, values).then((r) => {
            return r.rows ? r.rows[0] : {};
        });
    };

    pg.Client.prototype.execute = function(config, values) {

        let client = this;
        return this.executeQuery(client, config, values);
    };


    pg.Client.prototype.fetchAll = function(config, values) {
        let client = this;
        return this.executeQuery(client, config, values).then((r) => {
            return r.rows
        });
    };

    pg.Client.prototype.executeBulkInsertion = function(bulkData, columns, table) {
        let client = this;
        const bulkInsertStatement = pgp.helpers.insert(bulkData, columns, table);
        return this.executeQuery(client, bulkInsertStatement);
    }

    pg.Client.prototype.executeTransaction = async function(callback) {
        let client = this;

        try {
            await client.executeQuery(client, 'BEGIN');
            await callback(client);
            await client.executeQuery(client, 'COMMIT');
        } catch (e) {
            await client.executeQuery(client, 'ROLLBACK');
            throw e;
        }
    }
}

module.exports = {
    patch: patch
};