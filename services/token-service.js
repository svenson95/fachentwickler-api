const JWT = require('jsonwebtoken');
const crypto = require('crypto');

const VerificationToken = require('../models/user/VerificationToken');

module.exports = {
    generateVerificationToken: function(user, res, callback) {
        const generatedCode = () => {
            let code = "";
            do {
                code += crypto.randomBytes(3).readUIntBE(0, 3);
            } while (code.length < 6);
            return code.slice(0, 6);
        }
        const verificationToken = new VerificationToken({ _userId: user._id, code: generatedCode() });
        verificationToken.save(function (err, response) {
            if (err) {
                return res.status(500).send({
                    success: false,
                    code: "SaveVerificationTokenException",
                    message: 'Save verification token failed.',
                    error: err
                });
            }

            callback(verificationToken);
        });
    },
    signToken: function(userId) {
        return JWT.sign({
            iss: process.env.JWT_SECRET,
            sub: userId
        }, process.env.JWT_SECRET, { expiresIn: '30d' })
    },
    deleteToken: async function(code, res, callback) {
        await VerificationToken.remove({ code: code }, (err, response) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    code: "DeleteVerificationTokenException",
                    message: 'Delete verification token failed.',
                    error: err
                });
            }

            callback(response);
        });
    }
}
