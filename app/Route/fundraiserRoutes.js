import express from 'express';
import { uploadSingle } from '../middlewares/upload.js';  
import {
  registerFundraiser,
  getFundraiser,
  getAllFundraisers,
} from '../controllers/fundraiserController/fundraiserController.js';

const router = express.Router();

router.post('/fundraiser', uploadSingle('photo'), registerFundraiser); 
router.get('/fundraiser/:id', getFundraiser);
router.get('/getfundraiser', getAllFundraisers);

export default router;
