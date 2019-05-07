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

Function provided by pg-essential. The test.js file contains all the code examples that are required to execute these function. Below are some explanation about each function.

fetchOne : This function will return a single row result as an object
fetchAll : Will fetch all the rows from the db and will return the result as an array
executeBulkInsertion: This function can be used to execute bulk insertion

