const nodemailer = require('nodemailer');

module.exports = {
  sendMail: function (content, res, callback) {
    const transporter = nodemailer.createTransport({
      port: 465, // true for 465, false for other ports
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
      secure: true,
    });

    transporter.sendMail(content, function (err, response) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Send E-Mail failed.',
          error: err,
        });
      }

      callback(response);
    });
  },
};
