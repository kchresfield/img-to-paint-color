require('dotenv').config();

const got = require('got');

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

const getColors = async (twilioImgLink) => {
    try{
        const resp = await got(twilioImgLink);
        const awsRedirectUrl = resp.redirectUrls[1];
        const reqUrl = `https://api.imagga.com/v2/colors?image_url=${encodeURIComponent(awsRedirectUrl)}`;
        const colorApi = await got(reqUrl, { username: apiKey, password: apiSecret });
        const jsonResp = JSON.parse(colorApi.body)
        const backgroundCodes = jsonResp.result.colors.background_colors.map(colors => [colors.html_code.slice(1), [colors.r, colors.b, colors.g]]);
        const foregroundColorCodes = jsonResp.result.colors.foreground_colors.map(colors => [colors.html_code.slice(1), [colors.r, colors.b, colors.g]]);
        return {backgroundCodes, foregroundColorCodes};
    } catch (err) {
        console.log(err);
        throw(err);
    }
    
}

module.exports.getColors = getColors;