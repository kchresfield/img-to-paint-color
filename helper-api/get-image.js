require('dotenv').config();

const axios = require('axios');
const got = require('got');

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

const getColors = (imgUrl, aSid, mSid) => {
    console.log("I made it!")

    return axios.get(process.env.TESTER__LINK)
        .then(resp => {
            return resp.request.res.responseUrl
        })
        // .then(url => {
        //     const reqUrl =`https://api.imagga.com/v2/colors?image_url=${encodeURIComponent(url)}`
        //     return (async () => {
        //         try {
        //             const response = await got(reqUrl, { username: apiKey, password: apiSecret });
        //             console.log(response.body);`
        //             return response.body
        //         } catch (error) {
        //             console.log(error.response.body);
        //         }
        //     })();

        // })
        .then(resp => {
            // console.log("response type: ", typeof resp)
            // let jsonResp = JSON.parse(resp)
            let backgroundCodes = [['96948f', [140, 47, 30]], ['504335', [140, 47, 30]], ['85a8d6', [140, 47, 30]]]//jsonResp.result.colors.background_colors.map(colors => [colors.html_code.slice(1), [colors.r, colors.b, colors.g]])
            let foregroundColorCodes = [['252c19', [140, 47, 30]], ['797f57', [140, 47, 30]], ['8a3246', [140, 47, 30]]]//jsonResp.result.colors.foreground_colors.map(colors => [colors.html_code.slice(1), [colors.r, colors.b, colors.g]])
            return {backgroundCodes, foregroundColorCodes}
        })
        .catch((error) => {
            console.log(error);
        });

}


module.exports.getColors = getColors;