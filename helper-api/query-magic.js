const db = require('./db-helper');

const firstColorCheck = function(subArrOfColors){
    let result = false;
    subArrOfColors.forEach(colorArr => {
        console.log("colorArr: ", colorArr)
        let resultColor = db.connectToDb().collection('paint_colors')
            .findOne({_id: colorArr[0]})
        if(resultColor){
            result = true;
        }
    })
    return result;
}

async function queryMagic(foregroundColorArr){
    let rbgArr = foregroundColorArr[0][1];
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
        ]}).limit(5).toArray();

    similarColors.forEach(color => possibleColorsArr.push([color.name, color.number]));
    return possibleColorsArr;
}

module.exports = {
    queryMagic,
    firstColorCheck
} 