const Axios = require('axios');
const config = require('./config');
const mysql = require('mysql');
const util = require('util');
const db = mysql.createPool(config.mysql.connection);
db.query = util.promisify(db.query).bind(db);
const interval = config.interval * 1000;
main();


async function main() {
    timedCheckTemp();
}

async function timedCheckTemp() {
    const curTemp = await getTemp();
    saveTempInDb(curTemp);
    setTimeout( timedCheckTemp, interval)
}

async function getTemp() {
    const curTemp = await Axios.get(config.url, {headers: {'Authorization': "Bearer " + config.token}})
    const date = new Date();
    const result = parseFloat(curTemp.data.result).toFixed(2);
    console.log(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} => ${result}`);
    return result;
}

async function saveTempInDb(data) {
    const query = 'INSERT INTO temperature (value, timestamp) VALUES (?, UTC_TIMESTAMP())'
    const vals = [data];
    try {
        db.query(query, data);
    } catch (err) {
        console.dir(err);
    }
}