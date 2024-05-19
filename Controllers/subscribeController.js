const nodemailer = require('nodemailer');
const Subscription = require('../Model/subscribeModel');

const sendSubscriptionEmail = async (req, res) => {
    try {
        const { senderEmail } = req.body; 

        const existingSubscription = await Subscription.findOne({ senderEmail });

        if (existingSubscription) {
            return res.status(400).json({ status: 'error', message: 'You are already subscribed' });
        }

        const subscription = new Subscription({ senderEmail });
        await subscription.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'khalilkapo15@gmail.com',
                pass: 'vhpvalolvducobya'
            },
            tls: {
                rejectUnauthorized: false 
            }
        });

        const subject = 'Thank You for Subscribing';
        const htmlMessage = `
            <p>Dear Subscriber,</p>
            <p>Thank you for subscribing to our new travel newsletter.</p>
            <p>We look forward to sharing exciting updates and offers with you.</p>
            <p>Best regards,<br/>Tours Project Team</p>
        `;

        const mailOptions = {
            from: 'khalilkapo15@gmail.com',
            to: senderEmail,
            subject: subject,
            html: htmlMessage
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ status: 'success', message: 'Subscription email sent successfully' });
    } catch (error) {
        console.error('Error sending subscription email:', error);
        res.status(500).json({ status: 'error', message: 'Failed to send subscription email' });
    }
};

module.exports = {
    sendSubscriptionEmail
};
