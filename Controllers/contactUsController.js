const Contact = require('../Model/contactUsModel');
const nodemailer = require('nodemailer');


exports.sendMessage = async (req, res) => {
    try {
        const { firstName, lastName, email, subject, message } = req.body;

        const newMessage = new Contact({
            firstName,
            lastName,
            email,
            subject,
            message
        });

        await newMessage.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: "khalilkapo15@gmail.com",
                pass: 'vhpvalolvducobya'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: email,
            to: 'khalilkapo15@gmail.com',
            subject: `Message sent from ${email}`,
            text: message
        };

        console.log('Sending email...');
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'An error occurred while sending the email', error: error.message });
            } else {
                console.log('Email sent:', info.response);
                res.status(200).json({ message: 'Message sent successfully' });
            }
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'An error occurred while processing your request', error: error.message });
    }
};