const User = require('../Model/registerModel');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'khalilkapo15@gmail.com',
        pass: 'zwxntcgqnqxuyedv'
    },
    tls: {
        rejectUnauthorized: false
    }
});

exports.registerOrganizer = async (req, res) => {
    try {
        const { firstName, lastName, email, birthdate } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: 'Email already exists' });
        }

        const today = new Date();
        const birthDate = new Date(birthdate);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 22) {
            return res.status(400).json({ message: 'User must be at least 22 years old' });
        }

        const password = generateRandomPassword();

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            email,
            birthdate,
            password: hashedPassword, 
            role: 'organizer'
        });
        await user.save();

        await sendActivationEmail(email, password);

        res.status(201).send({ message: 'Organizer registered successfully' });
    } catch (error) {
        console.error('Error registering organizer:', error);
        res.status(500).send({ message: error.message });
    }
};

function generateRandomPassword() {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let password = '';
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }
    return password;
}

async function sendActivationEmail(email, password) {
    try {
        const mailOptions = {
            from: 'khalilkapo15@gmail.com',
            to: email,
            subject: 'Your account details',
            text: `Your account has been successfully registered.\n\nYour randomly generated password: ${password}\n\nPlease use this password to login to your account.`
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending activation email:', error);
        throw new Error('Failed to send activation email');
    }
};
