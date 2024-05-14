const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring'); 
const RegisterUser = require('../Model/registerModel');

const JWT_SECRET_KEY = 'your_jwt_secret_key';

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

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await RegisterUser.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        if (user.role === 'user' && !user.active) {
            return res.status(401).json({ message: 'This email is not active' });
        }

        if (user.role === 'organizer' && !user.active) {
            user.active = true;
            await user.save();
        }

        const userData = {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            active: user.active,
            gender: user.gender || null,
            phone: user.phone || null,
        };

        const token = jwt.sign(userData, JWT_SECRET_KEY, { expiresIn: '7d' });

        res.status(200).json({
            token: token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await RegisterUser.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otpCode = randomstring.generate({
            length: 6,
            charset: 'numeric'
        });

        user.otpCode = otpCode;
        await user.save();

        const mailOptions = {
            from: 'khalilkapo15@gmail.com',
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otpCode}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Failed to send OTP' });
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({ message: 'OTP sent successfully' });
            }
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await RegisterUser.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        const mailOptions = {
            from: 'khalilkapo15@gmail.com',
            to: email,
            subject: 'Password Reset Successful',
            text: 'Your password has been successfully reset.'
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Failed to send confirmation email' });
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({ message: 'Password reset successful' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.SignUpOrLoginWithGoogle = async (req, res) => {
 
    const { firstName, lastName, email, password, birthdate, role, active } = req.body;
    const user = await RegisterUser.findOne({ email });
  
    if(user) {
      const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            active: user.active,
          },
          JWT_SECRET_KEY,
          { expiresIn: "7d" }
        );
    
        res.status(200).json({
          token: token,
        });
    }else{

      const usr = new RegisterUser({
          firstName,
          lastName,
          email,
          birthdate,
          role:'user',
          active: true,
      })
      usr.password = await bcrypt.hash(email, 10);
      await usr.save()
  
      const token = jwt.sign(
          {
            id: usr._id,
            email: usr.email,
            firstName: usr.firstName,
            lastName: usr.lastName,
            role: usr.role,
            active: usr.active,
          },
          JWT_SECRET_KEY,
          { expiresIn: "7d" }
        );
    
        res.status(200).json({
          token: token,
        });
    }
  
};