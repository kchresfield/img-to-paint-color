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
	const messageListFromNumber = await twilio.messages.list({to: process.env.TWILIO_NUMBER});
	const firstMessageSid = messageListFromNumber[0].sid;
	const data = await twilio.messages(firstMessageSid).media.list({limit:5})
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

});

app.listen(port, ()=> {
  console.log(`listening on port ${port}`);
});





