const User = require('../Model/registerModel');
const bcrypt = require('bcryptjs');

exports.registerOrganizer = async (req, res) => {
    try {
        const { firstName, lastName, email, birthdate, password, active } = req.body;

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

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            email,
            birthdate,
            password: hashedPassword,
            role: 'organizer',
            active: active === 'Active' // Set active status from form input
        });
        await user.save();

        res.status(201).send({ message: 'Organizer registered successfully' });
    } catch (error) {
        console.error('Error registering organizer:', error);
        res.status(500).send({ message: error.message });
    }
};