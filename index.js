function patch(pg, options) {
    let client = pg.Client;
    var origQuery = pg.Client.prototype.query;
    pg.Client.prototype.fetchOne = function(config, values) {
        var client = this;
        return new Promise((resolve, reject) => {
            return origQuery.apply(client, [
                config,
                values,
                (e, r) => {
                    if (e) {
                        return reject(e);
                    } else {
                        return resolve(r.rows ? r.rows[0] : {});
                    }
                }
            ]);
        });
    };
}

module.exports = {
    patch: patch
};
