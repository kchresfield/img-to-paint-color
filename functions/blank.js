const accountSid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'; // Your Account SID from www.twilio.com/console
const authToken = 'your_auth_token'; // Your Auth Token from www.twilio.com/console

const twilio = require('twilio');
const client = new twilio(accountSid, authToken);

client.messages
  .create({
    body: 'Hello from Node',
    to: '+12345678901', // Text this number
    from: '+12345678901', // From a valid Twilio number
  })
  .then((message) => console.log(message.sid));

exports.handler = function (context, event, callback) {
  callback(null, {});
};
