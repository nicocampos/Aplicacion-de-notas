const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'developernicoc@gmail.com', // user
        pass: 'krpejzzknkjsbfnm'  // krpejzzknkjsbfnm
    }
});


module.exports = transporter;