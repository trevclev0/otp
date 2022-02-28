import express from 'express';

const router = express.Router();

router.get('/otp/phone', async (req, res) => {
    console.log('Phone OTP');
    res.json({ Status: 'success', Details: 'OTP SMS sent' });
});

export default router;
