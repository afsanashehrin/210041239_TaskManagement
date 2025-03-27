const nodemailer = require('nodemailer');
const config = require('../config');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS
  }
});

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${config.CLIENT_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: config.EMAIL_USER,
    to: email,
    subject: 'Email Verification - Task Management System',
    html: `
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link will expire in 1 hour.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };