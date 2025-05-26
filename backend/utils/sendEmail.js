const nodemailer = require('nodemailer')

//transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'muthaharsmart@gmail.com',
    pass: 'inet sypz gnto sprk',
  },
});

/**
 * Sends an email using nodemailer.
 * @param {string} to - Recipient's email address
 * @param {string} subject - Subject line of the email
 * @param {string} text - Plain text content
 * @param {string} html - HTML content
 */

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: '"Muthahar\'s Mart" <muthaharsmart@gmail.com>', // sender
      to, // receiver
      subject,
      text,
      html,
    });

    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};

module.exports = sendEmail;