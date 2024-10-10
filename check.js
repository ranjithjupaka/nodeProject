const mysql1 = require('mysql2/promise');

const connection = mysql1.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'exc'
});
async function runQuery(query, params) {
    const [rows] = await connection.execute(query, params);
     return rows;
}

module.exports = {
    runQuery,
  };