// Controller: emailController.js
const nodemailer = require('nodemailer');

const sendEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email address is required' });
        }

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

        const mailOptions = {
            from: 'khalilkapo15@gmail.com',
            to: email,
            subject: 'API Documentation',
            text: `Dear user,\n\nPlease find the API documentation at the following link: https://csmodernacademyedu-my.sharepoint.com/:b:/g/personal/adam120000067_cs_modern-academy_edu_eg/ER7niNTbrPBGjTXZEdJgsUUBbdpAFTAuZ6aQXSiZDnoOpA?e=y5Sm7H\n\nBest regards,\nThe API Team`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send email' });
    }
};

module.exports = {
    sendEmail
};
