# Pg-essential-dev

This package provides you basic functions for interacting with postgres using nodeJS.
It is developed on top of pg-spice. 

# Installation
```
npm install pg-essential --save
```

# Usage
Apply pg-essential patch on your node-postgres module and add the following code at the start of the app.

```
var pg = require('pg');
require('pg-essential').patch(pg);
```

It will add few prototype functions to pg.Client

# Features
pg-essential doesn't manage the connection pool for you. The connection is expected to be maintained by the developer. It adds number of helper functions to your client object. Getting the connection from pool or closing the connection and giving it back to the pool will be the responsibilty of the developer. pg-essential does not cater connection pooling. However, the code examples below illustrates on how to achieve all this.

The test.js file contains all the code examples that are required to execute these functions. Some explanation about each function is mentioned below:

## fetchOne: ## 
This function will return a Promise and the result of this Promise will be a single object, which is the first row of your query's result.

## execute: ## 
The execute function simply executes the query and will return a promise containing the result. 

## fetchAll: ##
 
 This function will return a Promise and the result of this Promise will be an array containing all the rows of your query's result.

 The code below demonstrates the usage of fetchOne, fetchAll, execute functions.

```
  return getPool().then((p) => {
        return p.getClient().then((connection) => {
            /* you can call fetchAll, execute in a similar way. Just replace fetchOne in the following line with respective(fetchAll,execute) function. */

            return connection.client.fetchOne(query, params).then((results) => {
                connection.done();
                return results;
            }).catch((err) => {
                connection.done();
                return Promise.reject(err);
            })
        });
    });
```

## executeBulkInsertion: ##
This function helps you in inserting multiple records in a table using a single Database call.
It requires following three arguments:

1) bulkData => an array of objects, where each object in the array represents a row that needs to be inserted in that table.
2) columns => A string array containing the name of columns to be part of the insert query.
3) tableName => The table in which you want to insert the rows.

And it also ensures that the queries are executed in a way that no SQL injection is possible. It internally uses pg-promise helper to execute the bulk insertion.
Here is an example of how you can use the bulkInsertion function.


```
  return getPool().then((p) => {
        return p.getClient().then((connection) => {
            let bulkData = [];
            for (let count = 0; count < 500; count++) {
                bulkData.push({
                    id: chance.guid(),
                    name: chance.name()
                });
            }
            const columns = ['id', 'name'];
            await connection.client.executeBulkInsertion(bulkData, columns, 'test');
            connection.done();
            });
    });
```

## executeTransaction: ##

The executeTransaction function is used to execute your queries in transactions. It will commit your changes it self if all the queries executed successfully or will rollback and throw exeception if the any of the query in the transaction failed.

It takes the callback as an argument. The connection client will be passed to the callback function and the callback function can execute it's query on the same client. You can write your query execution logic inside the callback function using the client object passed to your callback by the executeTransaction function. 

```
  return getPool().then((p) => {
        return p.getClient().then((connection) => {
            // Insert into test and test_history table as a single transaction
              await connection.client.executeTransaction(async client => {
                await client.execute(
                    `INSERT INTO test (id, name, created_at, updated_at) VALUES (:id, :name, jsNow(), jsNow())`, {
                        id: chance.guid(),
                        name: chance.word()
                    });

                await client.execute(
                    `INSERT INTO test_history (id, name, created_at, updated_at) VALUES (:id, :name, jsNow(), jsNow())`, {
                        id: chance.guid(),
                        name: chance.word()
                    });

                    connection.done();
            }).catch(()=>{
                connection.done();
            });
    });
```

For more assistance you can look into the code in the examples folder. You can also get help by looking into the tests written in the test.js file.