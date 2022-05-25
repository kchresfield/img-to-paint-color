require('dotenv').config();

const colorApi = require('./helper-api/get-image');
const query = require('./helper-api/query-magic');
const db = require('./helper-api/db-helper');

const express = require("express");
const app = express();
const port = 3000;


const MessagingResponse = require('twilio').twiml.MessagingResponse;
const e = require('express');

const accountSid = process.env.ACCOUNT_SID; 
const authToken = process.env.AUTH_TOKEN;

const twilio = require('twilio')(accountSid, authToken);

app.post('/picToBMColor', async (req, res) => {
	twilio.messages.list({to: process.env.TWILIO_NUMBER})
		.then(messages => {
			colorApi.getColors('https://api.twilio.com/2010-04-01', messages[0].accountSid, messages[0].sid)
			return messages[0].sid
		})
		.then(messageSid => {
			let a = twilio.messages(messageSid)
			.media
      		.list({limit:5})
			return a;
		})	
		.then(res => {
			const uriWOJson = res[0].uri.slice(0, -5)
			const linkToPhoto = `https://api.twilio.com${uriWOJson}`;
			const colorCodes = colorApi.getColors(linkToPhoto);
			return colorCodes;
		})
		.then(colorCodeResp => {
			const closeMatchArr = query.queryMagic(colorCodeResp.foregroundColorCodes)
			return closeMatchArr;
		})
		.then(colorNameNumArr => {
			let message = "";

			if (!colorNameNumArr.length) {
				message += "Sorry, we did not find any Benjamin Moore matches for that color. Please try again."
			} else {
				message += "We found some close matches! "
				colorNameNumArr.forEach(colorNameNum => {
					message += `${colorNameNum[0]} #${colorNameNum[1]}, `
				});
				message = message.slice(0, message.length - 2) + "."
			}

			return message;
		})
		.then(message => {
			const twiml = new MessagingResponse();
			twiml.message(message);
			res.writeHead(200, { 'Content-Type': 'text/xml' });
			res.end(twiml.toString())
		})
		.catch(err => {
			res.send((err))
		})
})


  app.post("/rebuildDB", async (req, res) => {
    res.send(db.getColorsFromBenjaminMoore());
  })


app.listen(port, ()=> {
  console.log(`listening on port ${port}`);
});





