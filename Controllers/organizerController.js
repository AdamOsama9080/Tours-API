const User = require('../Model/registerModel');
const bcrypt = require('bcryptjs');

exports.registerOrganizer = async (req, res) => {
    try {
        const { firstName, lastName, email, birthdate, password, active } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: 'Email already exists' });
        }

        // Calculate age
        const today = new Date();
        const birthDate = new Date(birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 22) {
            return res.status(400).json({ message: 'User must be at least 22 years old' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            firstName,
            lastName,
            email,
            birthdate,
            password: hashedPassword,
            role: 'organizer',
            active: active === 'Active'
        });
        
        // Save the user
        await user.save();

        // Send success response
        res.status(201).send({ message: 'Organizer registered successfully' });
    } catch (error) {
        console.error('Error registering organizer:', error);
        res.status(500).send({ message: error.message });
    }
};

exports.getAllOrganizers = async (req, res) => {
    try {
        const organizers = await User.find({ role: 'organizer' }, 'firstName lastName email active');
        res.status(200).json(organizers);
    } catch (error) {
        console.error('Error fetching organizers:', error);
        res.status(500).send({ message: error.message });
    }
};

exports.toggleActivation = async (req, res) => {
    try {
        const { id } = req.params;
        const organizer = await User.findById(id);
        
        if (!organizer) {
            return res.status(404).send({ message: 'Organizer not found' });
        }

        organizer.active = !organizer.active;
        await organizer.save();

        res.status(200).send({ message: 'Activation status updated successfully', active: organizer.active });
    } catch (error) {
        console.error('Error toggling activation status:', error);
        res.status(500).send({ message: error.message });
    }
};
