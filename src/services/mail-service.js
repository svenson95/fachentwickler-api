const nodemailer = require('nodemailer');

const { internalErrorResponse } = require('../helper/utils.js');

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

    transporter.sendMail(content, function (sendError, response) {
      if (sendError) {
        internalErrorResponse('Send E-Mail failed. Internal server error.', sendError, res);
      } else {
        callback();
      }
    });
  },
};