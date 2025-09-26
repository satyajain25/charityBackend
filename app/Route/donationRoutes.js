import express from 'express';
import { createDonation, getAllDonations,verifyPayment }from "../controllers/index.js"

const router = express.Router();

router.post('/donate', createDonation);
router.get('/donations', getAllDonations);
router.post('/verifyPayment', verifyPayment);

export default router;
