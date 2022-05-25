require('dotenv').config();

const axios = require('axios');
const got = require('got');

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

const getColors = (imgUrl, aSid, mSid) => {
    return axios.get(imgUrl, aSid, mSid)
        .then(resp => {
            return resp.request.res.responseUrl
        })
        .then(url => {
            const reqUrl =`https://api.imagga.com/v2/colors?image_url=${encodeURIComponent(url)}`
            return (async () => {
                try {
                    const response = await got(reqUrl, { username: apiKey, password: apiSecret });
                    return response.body
                } catch (error) {
                    console.log(error.response.body);
                    return error.response.body;
                }
            })();

        })
        .then(resp => {
            let jsonResp = JSON.parse(resp)
            let backgroundCodes = jsonResp.result.colors.background_colors.map(colors => [colors.html_code.slice(1), [colors.r, colors.b, colors.g]])
            let foregroundColorCodes = jsonResp.result.colors.foreground_colors.map(colors => [colors.html_code.slice(1), [colors.r, colors.b, colors.g]])
            return {backgroundCodes, foregroundColorCodes}
        })
        .catch((error) => {
            return error;
        });

}

module.exports.getColors = getColors;