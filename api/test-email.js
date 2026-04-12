require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.RECOVERY_EMAIL,
    subject: 'Test Email',
    text: 'This is a test email'
}, (err, info) => {
    if (err) {
        console.error('Failed to send email:', err);
    } else {
        console.log('Email sent successfully:', info.response);
    }
});
