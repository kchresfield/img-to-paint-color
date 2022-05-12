require('dotenv').config();

const accountSid = process.env.ACCOUNT_SID; 
const authToken = process.env.AUTH_TOKEN;

const VoiceResponse = require('twilio').twiml.VoiceResponse;
const twilio = require('twilio')(accountSid, authToken);


twilio.recordings
      .list() //{callSid: 'CAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', limit: 20}
      .then(recordings => console.log(recordings));