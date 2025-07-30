const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendUserStatusEmail(user, status) {
  let subject = '', text = '';
  if (status === 'active') {
    subject = 'Your account has been approved!';
    text = `Hello ${user.username},\n\nYour account on BlogWeb has been approved. You can now log in and start using the site!`;
  } else if (status === 'rejected') {
    subject = 'Your registration was rejected';
    text = `Hello ${user.username},\n\nWe are sorry, but your registration on BlogWeb was rejected. If you believe this is a mistake, please contact the admin.`;
  }
  if (!user.email) return;
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject,
      text,
    });
  } catch (err) {
    console.error('Failed to send email:', err);
  }
}

async function sendAdminNewUserEmail(user) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: 'New User Registration Request',
      text: `A new user has registered and is pending approval.\n\nUsername: ${user.username}\nEmail: ${user.email}`,
    });
  } catch (err) {
    console.error('Failed to send admin notification email:', err);
  }
}

module.exports = { sendUserStatusEmail, sendAdminNewUserEmail };
