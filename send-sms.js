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
			return messages[0].sid;
		})
		.then(messageSid => {
			let a = twilio.messages(messageSid)
			.media
      		.list({limit:5})
			return a;
		})	
		.then(async res => {
			const uriWOJson = res[0].uri.slice(0, -5);
			const linkToPhoto = `https://api.twilio.com${uriWOJson}`;
			const colorCodes = await colorApi.getColors(linkToPhoto);
			return colorCodes;
		})
		.then(async colorCodeResp => {
			const colorQueryValue = colorCodeResp.foregroundColorCodes.length ? colorCodeResp.foregroundColorCodes : colorCodeResp.backgroundCodes;
			const closeMatchArr = await query.queryMagic(colorQueryValue);
			return closeMatchArr;
		})
		.then(colorNameNumArr => {
			let message = "";

			if (!colorNameNumArr.length) {
				message += "Sorry, we did not find any Benjamin Moore matches for that color. Please adjust your lighting or try focusing on one color.";
			} else {
				message += "We found some Benjamin Moore paint matches! ";

				colorNameNumArr.forEach(colorNameNum => {
						message += `${colorNameNum[0]} #${colorNameNum[1]}, `;
				});
				message = message.slice(0, message.length - 2) + ".";
			}

			return message;
		})
		.then(message => {
			const twiml = new MessagingResponse();
			twiml.message(message);
			res.writeHead(200, { 'Content-Type': 'text/xml' });
			res.end(twiml.toString());
		})
		.catch(err => {
			res.send((err));
		})
})

app.post('/picToBMColor1', async (req, res) => {
	const messageListFromNumber = twilio.messages.list({to: process.env.TWILIO_NUMBER});
	const firstMessageSid = messageListFromNumber[0].sid;
	const data = twilio.messages(firstMessageSid).media.list({limit:5})
	const uriWOJson = data[0].uri.slice(0, -5);
	const linkToPhoto = `https://api.twilio.com${uriWOJson}`;
	const colorCodes = await colorApi.getColors(linkToPhoto);
	const colorQueryValue = colorCodes.foregroundColorCodes.length ? colorCodes.foregroundColorCodes : colorCodes.backgroundCodes;
	const closeMatchArr = await query.queryMagic(colorQueryValue);

	let message = "";

	if (!closeMatchArr.length) {
		message += "Sorry, we did not find any Benjamin Moore matches for that color. Please adjust your lighting or try focusing on one color.";
	} else {
		message += "We found some Benjamin Moore paint matches! ";

		closeMatchArr.forEach(colorNameNum => {
			message += `${colorNameNum[0]} #${colorNameNum[1]}, `;
		});
		message = message.slice(0, message.length - 2) + ".";
	}

	const twiml = new MessagingResponse();
	twiml.message(message);
	res.writeHead(200, { 'Content-Type': 'text/xml' });
	res.end(twiml.toString());

})


app.post("/rebuildDB", async (req, res) => {
	// res.send(db.getColorsFromBenjaminMoore());
})

app.post('/testing', (req, res) => {
	// return db.getColorsFromBenjaminMoore()
	return colorApi.getColors('https://api.twilio.com/2010-04-01/Accounts/AC5d458efe683db39fc6bf27e94d54f2c7/Messages/MM0a4947d155cc2d8ed130d199d552a636/Media/MEb20aaf6b52194ae551647ab62b6782e2')
})


app.listen(port, ()=> {
  console.log(`listening on port ${port}`);
});





