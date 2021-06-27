const VerificationToken = require('../models/user/VerificationToken');
const crypto = require('crypto');

module.exports = {
    generateVerificationToken: function(user, res, callback) {
        const verificationToken = new VerificationToken({ _userId: user._id, code: crypto.randomBytes(3).toString('hex') });
        verificationToken.save(function (err, response) {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: 'Save verification token failed.',
                    error: err
                });
            }

            callback(verificationToken);
        });
    },
    deleteToken: async function(code, res, callback) {
        await VerificationToken.remove({ code: code }, (err, response) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: 'Delete verification token failed.',
                    error: err
                });
            }

            callback(response);
        });
    }
}
