import express from 'express';
import sendOtpEmail from './send-otp-email.mjs';
import sendOtpPhone from './send-otp-phone.mjs';
import verifyOtp from './verify-otp.mjs';

const router = express.Router();

router.use(sendOtpEmail);
router.use(sendOtpPhone);
router.use(verifyOtp);

export default router;
