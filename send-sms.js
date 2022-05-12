require('dotenv').config();

const colorApi = require('./helper-api/get-image');
const query = require('./helper-api/query-magic');

const express = require("express");
const app = express();
const port = 3000;

const db = require('./helper-api/db-helper');

const accountSid = process.env.ACCOUNT_SID; 
const authToken = process.env.AUTH_TOKEN;

const twilio = require('twilio')(accountSid, authToken);

app.post('/welcome', async (req, res) => {
	twilio.messages.list({to:'+16469565214'})
		.then(messages => {
			console.log(messages[0])
			// getImage.getImage('https://api.twilio.com/2010-04-01', messages[0].accountSid, messages[0].sid)
			return messages[0].sid
		})
		.then(messageSid => {
			let a = twilio.messages(messageSid)
			.media
      		.list({limit:5})
			return a;
		})	
		.then(res => {
			console.log(res[0].uri)
			const uriWOJson = res[0].uri.slice(0, -5)
			const linkToPhoto = `https://api.twilio.com${uriWOJson}`;
			console.log("here's the link to the photo: ", linkToPhoto);
			const colorCodes = colorApi.getColors(linkToPhoto);
			return colorCodes; // array of sub arrays
		})
		.then(colorCodeResp => {
			const closeMatchObj =  await query.queryMagic([140, 47, 30])
			return a;
		})
		.then(colorsForUser => {
			// send a text back to the user with the color name
			const twiml = new MessagingResponse()
  			twiml.message('We found some close matches!');
  			res.writeHead(200, {'Content-Type': 'text/xml'});
  			res.end(twiml.toString())
		})
		
})

app.post('/testApi', async(req, res) => {

	// db.connectToDb().collection('paint_colors')
	// .find({$or: [{_id: '252c19'}, {_id:'797f57'}, {_id:'8a3246'}]}, (err, res) => { //resp.foregroundColorCodes[0][0]
	// 	if(err) return err;
	// 	if(!res){
			
			
			// query magic
			// let promise = new Promise((resolve, reject) => {
			// 	console.log("when was I hit?")
			// 	resolve(query.queryMagic([140, 47, 30]))
			// 	console.log("when was I hit2?")
			//   });
			// const closeMatchObj =  query.queryMagic([140, 47, 30]) // /* resp.foregroundColorCodes[0][1]*/
			// let closeMatchObj = await promise;
			console.log("quesy magic val: ", query.queryMagic)
			const closeMatchArr =  await query.queryMagic([140, 47, 30])
										// .then(resp => {
										// 	console.log("the response back from query Magic:", resp)
										// })
			const twiml = new MessagingResponse()
			twiml.message('We found some close matches!');
			res.writeHead(200, {'Content-Type': 'text/xml'});
			res.end(twiml.toString())

			console.log("close match:", closeMatchObj)
			res.send(closeMatchObj)

			// 
			// let checkingFCC = 
			// query.firstColorCheck([['b19557', [140, 47, 30]], ['504335', [140, 47, 30]], ['85a8d6', [140, 47, 30]]])
			// 	.then(res => {
			// 		console.log("checkingFCC: ", checkingFCC)

			// 		res.send(checkingFCC)
			// 	})
	// 	}
	// })
	// let a = colorApi.getColors()
	
	// a.then(resp => {
	// 	console.log(resp)
		
	// })

})


app.listen(port, ()=> {
  console.log(`listening on port ${port}`);
});





