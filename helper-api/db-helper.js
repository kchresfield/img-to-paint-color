require('dotenv').config();

const got = require('got');
const BluebirdPromise = require('bluebird')
const MongoClient = require('mongodb').MongoClient;

const databaseName = 'BENJAMIN_MOORE_PAINT';
const collectionName = 'paint_colors';
let dbConnection;
let db;

async function connectToTheDB(){
    const dbUri = 'mongodb://127.0.0.1:27017';
    db = await MongoClient.connect(dbUri);
    dbConnection = db.db(databaseName);
    return dbConnection;
}

async function populateMongoDb(){
    const dbUri = `mongodb://127.0.0.1:27017/${databaseName}`;

    try{
        db = await MongoClient.connect(dbUri);
        dbConnection = db.db(databaseName);
        await dbConnection.createCollection(collectionName);
        let counter = await getColorsFromBenjaminMoore();
    } catch (err){
        console.log(err);
        throw(err);
    } finally {
        db.close();
    }
}

async function dropDb(){
    const dbUri = `mongodb://127.0.0.1:27017/${databaseName}`;
    let db = await MongoClient.connect(dbUri);
    let connectionToDb = db.db(databaseName)
    let dropped = await connectionToDb.dropDatabase();
    console.log(`Dropped ${databaseName} database`, dropped)
    db.close()
}

async function getColorsFromBenjaminMoore () {
    try{
        const bmDataRaw = await got('https://www.benjaminmoore.com/api/colors');
        const jsonResp = JSON.parse(bmDataRaw.body);
        const paintVals = Object.values(jsonResp.colors);

        let counter = 0;

        await BluebirdPromise.each(paintVals, async (colorObj) => {
            const hex = colorObj.hex.toLowerCase();
            let rgb = convertHexToRGB(hex);
            await dbConnection.collection(collectionName).insertOne({ hex: hex, name: colorObj.name, r: rgb[0], g: rgb[1], b: rgb[2], number: colorObj.number});
            counter++; 
        });

        console.log(`${counter} colors added to the ${collectionName} collection`);

        return counter;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const convertHexToRGB = hex => {

    function hex2RGB(char1, char2){
        const val1 = parseInt(char1, 16) * 16
        const val2 = parseInt(char2, 16)
        return val1 + val2;
    }

    const r = hex2RGB(hex[0], hex[1]);
    const g = hex2RGB(hex[2], hex[3]);
    const b = hex2RGB(hex[4], hex[5]);

    return [r, g, b];
}

const connectToDb = () => {
    return dbConnection;
}

// populateMongoDb();
connectToTheDB()
// dropDb()


module.exports = {
    connectToDb
}