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

    it.only('calling executeTransaction function 500 times with 250 commits & 250 rollbacks', async function() {
        this.timeout(9000);

        const transactionCount = 10,
            alreadyaddedID = chance.guid(),
            getTestTableRowCount = `SELECT count(*) FROM test`,
            rowCountBeforeExecution = (await db.execute(getTestTableRowCount)).rows[0].count;

        // inserting a record in test table for executing rollback condition
        await db.execute(`INSERT INTO test (id, name, created_at, updated_at) VALUES (:id, :name, jsNow(), jsNow())`, {
            id: alreadyaddedID,
            name: chance.word()
        });


        for (let count = 1; count <= transactionCount; count++) {
            // successful transaction
            await db.executeTransaction(async client => {
                await client.execute(
                    `INSERT INTO test (id, name, created_at, updated_at) VALUES (:id, :name, jsNow(), jsNow())`, {
                        id: chance.guid(),
                        name: chance.word()
                    });
            });

            // transaction with rollback
            await db.executeTransaction(async client => {
                try {
                    await client.execute(
                        `INSERT INTO test (id, name, created_at, updated_at) VALUES (:id, :name, jsNow(), jsNow())`, {
                            id: alreadyaddedID,
                            name: chance.word()
                        });
                } catch (ex) {
                    console.log('Rollback count: ' + count);
                }
            });
        }

        const rowCountAfterExecution = (await db.execute(getTestTableRowCount)).rows[0].count;

        expect(rowCountAfterExecution - rowCountBeforeExecution).to.equal(transactionCount + 1);

        // deleting all records from test table
        //await db.execute(lib.constants.common.db.one, `DELETE FROM test`);
    });

});