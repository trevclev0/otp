import express from 'express';
import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import hbs from 'nodemailer-express-handlebars';
// const { OTP } = require('../sequelize');


// To add minutes to the current time
const getExpirationDate = (date, minutes) => new Date(date.getTime() + minutes * 6e4);

const validOtpTypes = [ 'VERIFY', 'FORGET', '2FA' ];

// Create nodemailer transporter
const emailer = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
        user: `${process.env.EMAIL_ADDRESS}`,
        pass: `${process.env.EMAIL_PASSWORD}`,
    },
});

emailer.use('compile', hbs({
    viewEngine: {
        extname: '.hbs',
        layoutsDir: './templates/email',
        defaultLayout: false,
        partialsDir: './templates/partials',
    },
    viewPath: './templates/email',
    extName: '.hbs',
}));

await emailer.verify();


const router = express.Router();
router.post('/otp/email', async ({ body : { email, type }}, res) => {
    try {
        if (!email || !type) {
            return res.status(StatusCodes.BAD_REQUEST).json({ Status: 'Failure', Details: `${ReasonPhrases.BAD_REQUEST} - Missing required parameter(s)` });
        }
        if (!validOtpTypes.includes(type)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ Status: 'Failure', Details: `${ReasonPhrases.BAD_REQUEST} - Invalid type provided` });
        }

        // Generate OTP
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
        const currentDate = new Date();
        const expirationDate = getExpirationDate(currentDate,10);
        // Create OTP instance in DB
        // const otpInstance = await OTP.create({ otp, expirationDate };

        // Send Email
        const mailOptions = {
            from: `"${process.env.EMAIL_SENDER_NAME}"<${process.env.EMAIL_ADDRESS}>`,
            to: email,
            subject: type,
            template: type.toLowerCase(),
            context: { otp, expirationDate },
        };
        const info = await emailer.sendMail(mailOptions);

        console.info('Message sent: %s', info.messageId);
        return res.json({ Status: 'Success',  Details: 'OTP e-mail sent' });
    }
    catch (err) {
        const response = { Status: 'Failure', Details: err.message };
        return res.status(400).json(response);
    }
});

export default router;
