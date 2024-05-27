const Coupon = require('../Model/couponModel');
const User = require('../Model/registerModel');

module.exports = {
    validateCoupon: async (req, res) => {
        try {
            const { code, email } = req.body;
            const coupon = await Coupon.findOne({ code, email, isUsed: false });

            if (!coupon) {
                return res.status(404).json({ message: "Coupon not found or already used" });
            }

            // Apply the discount to the user's next booking (this logic depends on your application)
            // For demonstration, let's mark the coupon as used
            coupon.isUsed = true;
            await coupon.save();

            return res.status(200).json({ message: "Coupon is valid", discount: coupon.discount });
        } catch (error) {
            console.error('Error validating coupon:', error);
            return res.status(500).json({ message: "An error occurred while validating the coupon" });
        }
    }
}
