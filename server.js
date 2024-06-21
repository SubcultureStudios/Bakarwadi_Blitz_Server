const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));

const accountSid = 'AC3330848e3db4902f09a9201a2e06d89c'; // Twilio Account SID
const authToken = '015806446d3cacb780daa2fc00a68bd0'; // Twilio Auth Token
const client = twilio(accountSid, authToken);

// Load promocodes from file or database
let promocodes = JSON.parse(fs.readFileSync('promocodes.json'));

app.post('/whatsapp', (req, res) => {
    const from = req.body.From;
    const body = req.body.Body;

    // Assuming the message contains a predefined command or score check
    if (body.toLowerCase().includes('get promocode')) {
        if (promocodes.length > 0) {
            // Get and remove the first promocode from the list
            const promocode = promocodes.shift();

            // Save the remaining promocodes
            fs.writeFileSync('promocodes.json', JSON.stringify(promocodes));

            // Send promocode back to the user
            client.messages.create({
                from: 'whatsapp:+14155238886', // Your Twilio WhatsApp number
                to: from,
                body: `Congratulations! Your promocode is: ${promocode}`
            }).then(message => console.log(message.sid))
            .catch(error => console.error(error));

            res.status(200).send('Promocode sent');
        } else {
            res.status(200).send('No more promocodes available');
        }
    } else {
        res.status(200).send('Invalid command');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
