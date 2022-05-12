require('dotenv').config();

const axios = require('axios');
const mongoClient = require('mongodb').MongoClient;

const dburl = 'mongodb://127.0.0.1:27017';
let dbConnection;
const connection = mongoClient.connect(dburl, function(err, client) {

    if (err) {
        console.log('Error connecting to db', err);
    } else {
        console.error('We are connected to the db!');
        dbConnection = client.db('BENJAMIN_MOORE_PAINT')
        // getColorsFromBenjaminMoore()
      }
})

const connectToDb = () => {
    // console.log("does dbConnection have a value yet?", dbConnection)

    return dbConnection;
}

const getColorsFromBenjaminMoore = async () => {
    let a = await axios.get('https://www.benjaminmoore.com/api/colors')
        .then(bulkResp => {
            let a = Object.values(bulkResp.data.colors)
            let counter = 0;
            a.forEach(colorObj => {
                const hex = colorObj.hex.toLowerCase()
                let rgb = convertHexToRGB(hex);
                dbConnection.collection("paint_colors").insertOne({_id: hex, name: colorObj.name, r: rgb[0], g: rgb[1], b: rgb[2]}, (err, res) => {
                    if(err) return err;
                });
                counter++
            })
            console.log(`${counter} colors added to the paint_collection`)
        })
        .catch((error) => {
            console.log(error);
        });
    return a;
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

module.exports = {
    connectToDb,
    convertHexToRGB,
    getColorsFromBenjaminMoore
}