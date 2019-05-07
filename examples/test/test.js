global.config = require('../../config.js')();
let db = require('../core/db'),
    chance = require('chance').Chance(),
    expect = require('chai').expect;

describe("Pg-essential test", function() {


    it("fetchone", async function() {
        let result = await db.fetchOne('Select * from test');
        expect(result).to.be.an("Object");
    });

    it('bulk insertion - inserting 500 entries in test table', async () => {

        await db.execute('DELETE FROM test');
        let bulkData = [];
        for (let count = 0; count < 500; count++) {
            bulkData.push({
                id: chance.guid(),
                name: chance.name()
            });
        }
        const columns = ['id', 'name'];
        await db.executeBulkInsertion(bulkData, columns, 'test');
        const results = await db.fetchAll('SELECT id, name FROM test');
        expect(results.length).to.equal(500);
        expect(results).to.deep.equal(bulkData);
    });

});