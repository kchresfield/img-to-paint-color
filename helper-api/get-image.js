require('dotenv').config();

const axios = require('axios');
const got = require('got');

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

const getColors = (imgUrl, aSid, mSid) => {
    console.log("I made it!")

    return axios.get('https://api.twilio.com/2010-04-01/Accounts/ACacb3245f26dc428343e4f1cdd89bfbce/Messages/MM3b87fd30f696a1669ff7ce6a0f62cbf6/Media/ME9d4c43e9347399e3e8bb10584e5ac407')
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