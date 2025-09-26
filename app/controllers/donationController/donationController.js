import Donation from '../../models/Donation.js';
import { razorpayInstance } from '../../config/razorpay.js';
import crypto from 'crypto';
import Fundraiser from '../../models/Fundraiser.js';
export const createDonation = async (req, res) => {
  try {
    const { name, amount, fundraiserName } = req.body;

    if (!name || !amount || !fundraiserName) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: `donation_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    const donation = new Donation({
      name,
      amount,
      fundraiserName,
      orderId: order.id,
      paymentStatus: 'pending',
    });

    await donation.save();

    res.status(201).json({
      orderId: order.id,
      donationId: donation._id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const verifyPayment = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature === razorpay_signature) {
    try {
      const payment = await razorpayInstance.payments.fetch(razorpay_payment_id);

      if (payment.status === 'captured' && payment.order_id === razorpay_order_id) {
        const donation = await Donation.findOne({ orderId: razorpay_order_id });

        if (donation) {
          // ✅ Mark donation as completed
          donation.paymentStatus = 'completed';
          donation.paymentId = razorpay_payment_id;
          await donation.save();

          // ✅ AGGREGATE stats for that fundraiser
          const stats = await Donation.aggregate([
            {
              $match: {
                fundraiserName: donation.fundraiserName,
                paymentStatus: 'completed',
              }
            },
            {
              $group: {
                _id: null,
                totalAmount: { $sum: "$amount" },
                donorCount: { $sum: 1 }
              }
            }
          ]);

          const amountCollected = stats[0]?.totalAmount || 0;
          const donorCount = stats[0]?.donorCount || 0;

          // ✅ Update fundraiser document
          await Fundraiser.findOneAndUpdate(
            { name: donation.fundraiserName }, // Match by name
            {
              amountCollected,
              donorCount,
            }
          );

          // ✅ Send back response
          return res.status(200).json({
            message: "Payment verified and donation successful",
            fundraiserName: donation.fundraiserName,
            amountCollected,
            donorCount,
          });

        } else {
          return res.status(404).json({ error: "Donation not found for the provided orderId" });
        }
      } else {
        return res.status(400).json({ error: "Payment not captured or incorrect order ID" });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      return res.status(500).json({ error: "Error verifying payment", details: error.message });
    }
  } else {
    return res.status(400).json({ error: "Signature mismatch" });
  }
};



// export const verifyPayment = async (req, res) => {
//   const { razorpay_payment_id,  razorpay_order_id, razorpay_signature } = req.body;
//   const generatedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest('hex');
      
//   if (generatedSignature === razorpay_signature) {
//       try {
//           const payment = await razorpayInstance.payments.fetch(razorpay_payment_id);
          

//           if (payment.status === 'captured' && payment.order_id === razorpay_order_id) {
//             const donation = await Donation.findOne({ orderId: razorpay_order_id });

//               if (donation) {
//                   donation.paymentStatus = 'completed';
//                   donation.paymentId = razorpay_payment_id;
//                   await donation.save();
                  
//                   return res.status(200).json({ message: "Payment verified and donation successful" });

//               } else {
//                   return handleResponse(res, 404, "Donation not found for the provided orderId");
//               }
//           } else {
//             return res.status(400).json({ error: "Payment not captured or incorrect order ID" });

//           }
//       } catch (error) {
//           console.error('Error fetching payment details:', error);
//           return handleResponse(res, 500, "Error verifying payment", error.message);
//       }
//   } else {
//       return handleResponse(res, 400, "Signature mismatch");
//   }
// };
                                                            

export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find();
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
