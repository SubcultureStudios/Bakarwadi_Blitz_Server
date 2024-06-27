const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const fs = require('fs');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 80;

app.use(bodyParser.urlencoded({ extended: false }));

const accountSid = process.env.SID; // Twilio Account SID
const authToken = process.env.TOKEN; // Twilio Auth Token
const client = twilio(accountSid, authToken);

// Load promocodes from file or database
let promocodes = JSON.parse(fs.readFileSync('promocodes.json'));

app.get('/', function (req, res) {
    res.send("Hello");
  });

app.post('/whatsapp', (req, res) => {
    const from = req.body.From;
    const body = req.body.Body;

    console.log("Request received")
    console.log(from, body)

    // Assuming the message contains a predefined command or score check
    if (body.toLowerCase().includes('hi')) {
        // if (promocodes.length > 0) {
            // Get and remove the first promocode from the list
            // const promocode = promocodes.shift();

            // Save the remaining promocodes
            // fs.writeFileSync('promocodes.json', JSON.stringify(promocodes));

            // Send promocode back to the user
            client.messages.create({
                from: 'whatsapp:+917558685025', // Your Twilio WhatsApp number
                to: from,
                body: `Visit our booth to claim your Special Prize!`
            }).then(message => console.log(message.sid))
            .catch(error => console.error(error));

            res.status(200).send('Message Sent');
        // } else {
        //     res.status(200).send('No more promocodes available');
        // }
    } else {
        res.status(200).send('Invalid command');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
