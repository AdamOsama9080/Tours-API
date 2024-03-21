const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/Tour', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Mongoose schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minlength: 3 },
  lastName: { type: String, required: true, minlength: 3 },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: { type: String, required: true },
});

// Mongoose model
const User = mongoose.model('User', userSchema);

// Signup route
app.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
     newUser.save();

    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
