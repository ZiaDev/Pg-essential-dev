# Pg-essential-dev

This package provides you basic functions for interacting with postgres using nodeJS.
It is developed on top of pg-spice. 

# Installation

npm install pg-spice --save


# Usage
Apply pg-essential patch on your node-postgress module. Add the following code at the start of the app.

```
var pg = require('pg');
require('pg-essential').patch(pg);
```

It will add few prototype functions to pg.Client

# Features
pg-essential doesn't manage the connection pool for you. The connection will be maintained by the developer it self. It adds number of helper functions to your client object. Getting the connection from pool or closing the connection and giving it back to the pool will be the responsibilty of the developer. pg-essential will not do such things for you. However you can look into the examples code to how to achieve all this.

Function provided by pg-essential. The test.js file contains all the code examples that are required to execute these function. Below are some explanation about each function.

fetchOne : This function will return a Promise and the result of this Promise will be a single object, which is the first row of your query's result. Following is the example of how to 

```
  return getPool().then((p) => {
        return p.getClient().then((connection) => {
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
fetchAll : Will fetch all the rows from the db and will return the result as an array
executeBulkInsertion: This function can be used to execute bulk insertion

