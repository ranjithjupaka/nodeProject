const { runQuery } = require('./check');

let ss = runQuery('select * from exchange_rates where id > ? ',[1]);
console.log(ss);
