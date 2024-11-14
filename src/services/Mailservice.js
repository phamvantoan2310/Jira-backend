const nodemailer = require('nodemailer')

const sendEmail = async (to, subject, text) => {
    // Create a transporter object
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: `${process.env.MAIL}`,
      pass: `${process.env.PASS}`,
    }
  });
  
  // Configure the mailoptions object
  const mailOptions = {
    from: `${process.env.MAIL}`,
    to: to,
    subject: subject,
    text: text
  };
  
  // Send the email
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

module.exports = {sendEmail}