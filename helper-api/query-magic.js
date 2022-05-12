// need to create a query function that will grab a range of paint colors if there is not an exact match
// need to import db for the actual queries
// export function for reqult grabbing

const db = require('./db-helper');


const firstColorCheck = function(subArrOfColors){
    let result = false;
    subArrOfColors.forEach(colorArr => {
        console.log("colorArr: ", colorArr)
        let resultColor = db.connectToDb().collection('paint_colors')
            .findOne({_id: colorArr[0]})
        console.log("result: ", resultColor)
        if(resultColor){
            result = true;
        }
    })
    return result
    // return result? result : null;
}

async function queryMagic(rbgArr){
    const possibleColorsArr = [];
    let similarColors = await db.connectToDb().collection('paint_colors')
        .find({$and : [
            {
                r: {$gt: rbgArr[0] - 20, $lt: rbgArr[0] + 20}
            }, 
            {
                b: {$gt: rbgArr[1] - 20, $lt: rbgArr[1] + 20}
            }, 
            {
                g: {$gt: rbgArr[2] - 20, $lt: rbgArr[2] + 20}
            }
        ]}).toArray()

    similarColors.forEach(color => possibleColorsObj.push(color.name))
    return possibleColorsArr;
}

// gt and lt are greater than and less than. Will be used for RGB
// will query range of 30 for each r, g, and b
// add each hex and name to an obj, if there's overlap, no worries because cant have same key twice

module.exports = {
    queryMagic,
    firstColorCheck
} 