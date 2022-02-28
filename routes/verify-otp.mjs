import express from 'express';

const router = express.Router();

router.get('/otp/verify', async (req, res) => {
    console.log('Verify OTP');
    res.send('Verify OTP');
});

export default router;
