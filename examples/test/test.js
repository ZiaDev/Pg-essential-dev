global.config = require('../../config.js')();
let db = require('../core/db'),
    expect = require('chai').expect;

describe("Pg-essential test", function() {


    it("fetchone", async function() {
        let result = await db.fetchOne('Select * from test');
        expect(result).to.be.an("Object");
    });

});