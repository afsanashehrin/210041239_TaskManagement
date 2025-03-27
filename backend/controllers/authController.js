const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { sendVerificationEmail } = require('../utils/email');
const crypto = require('crypto');
const config = require('../config');


exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      role
    });

    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();

    await sendVerificationEmail(user.email, verificationToken);

   
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};


exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an email and password'
      });
    }

    
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

   
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

   
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        error: 'Please verify your email first'
      });
    }

  
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};


exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid verification token'
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};