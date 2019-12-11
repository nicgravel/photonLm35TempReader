require('dotenv').config();

const Axios = require('axios');
const config = require('./config');
const mysql = require('mysql');
const util = require('util');
const db = mysql.createPool(config.mysql.connection);
db.query = util.promisify(db.query).bind(db);
let interval = config.interval * 1000;


main();


async function main() {
    const myArgs = process.argv.slice(2);
    if(myArgs.length){
        interval = myArgs[0] * 1000;
    }
    timedCheckTemp();
}

async function timedCheckTemp() {
    const curTemp = await getTemp();
    (curTemp) ? saveTempInDb(curTemp) : console.log("No value received");
    setTimeout(timedCheckTemp, interval)
}

async function getTemp() {
    try {
        const curTemp = await Axios.get(config.url, { headers: { 'Authorization': "Bearer " + config.token } })
        const date = new Date();
        const result = roundValue(curTemp.data.result);
        console.log(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} => ${result}`);
        return result;
    } catch (err) {
        console.log(err);
        return null;
    }
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

function roundValue(temp, roundToPoint5 = false) {
    if (roundToPoint5) {
        const newTemp = parseFloat(temp).toFixed(2);
        const y = +newTemp + (0.5 / 2);
        return y - (y % (+0.5));
    }
    return parseFloat(temp).toFixed(1);
}