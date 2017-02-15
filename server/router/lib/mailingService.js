var nodemailer = require('nodemailer');

var service = {};

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'skillitapperrors@gmail.com',
        pass: '6996rFYVVPXV'
    }
});


service.mailClientError = function(error) {
  var errorString = JSON.stringify(error, null, ' ');
  var mailOptions = {
    from: 'errors@clienterrors.com',
    to: 'dane@skillitcooking.com',
    subject: 'Client Error',
    text: errorString
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if(error) {
      console.log('error', error);
    }
  });
};

service.mailServerError = function(error) {
  var errorString = JSON.stringify(error, null, ' ');
  var mailOptions = {
    from: 'errors@servererrors.com',
    to: 'dane+serverErrors@skillitcooking.com',
    subject: 'Server Error',
    text: errorString
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if(error) {
      console.log('error', error);
    }
  });
};

module.exports = service;