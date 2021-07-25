const VerificationToken = require('../models/user/VerificationToken');
const User = require('../models/user/User');

const tokenService = require('../services/token-service');
const mailService = require('../services/mail-service');
const verificationMail = require('../views/verification-email');
const changeEmail = require('../views/change-email');
const changePassword = require('../views/change-password');

module.exports = {

    findUser(key, value, res, callback) {
        User.findOne({ [key]: value }, (error, user) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    code: "UserNotFoundException",
                    message: "Find user by '" + key + "' failed.",
                    error: error
                });
            }

            callback(user);
        });
    },

    createUser(_user, res) {
        this.findUser('name', _user.name, res, (userByName) => {
            if (userByName) {
                return res.status(409).json({
                    success: false,
                    code: "UserNameExistException",
                    message: "Username is already taken."
                });
            }

            this.findUser('email', _user.email, res, (userByEmail) => {
                if (userByEmail) {
                    return res.status(409).json({
                        success: false,
                        code: "UserEmailExistException",
                        message: "E-Mail is already taken."
                    });
                }

                const { name, password, role, email, theme } = _user;
                const newUser = new User({ name, password, role, email, theme });
                newUser.save((err, createdUser) => {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            code: "SaveNewUserException",
                            message: "Save new user failed.",
                            error: err
                        });
                    }

                    this.sendVerificationCode(createdUser, res);
                });
            })
        });
    },

    forgotPassword(email, res) {
        this.findUser('email', email, res, (userByEmail) => {
            if (!userByEmail) {
                return res.status(200).json({
                    success: true,
                    message: 'User with e-mail ' + email + ' not found'
                });
            }

            tokenService.generateVerificationToken(userByEmail, res, (token) => {
                const mailOptions = {
                    from: 'no-reply@example.com',
                    to: userByEmail.email,
                    subject: 'Passwort ändern',
                    text: 'xxx',
                    html: changePassword.html(userByEmail, token)
                };

                mailService.sendMail(mailOptions, res,(response) => {
                    const jwtToken = tokenService.signToken(userByEmail);

                    return res.status(201).json({
                        success: true,
                        message: 'A verification link has been sent to ' + userByEmail.email + '. It will be expire after 24 hours.',
                        user: userByEmail,
                        token: jwtToken,
                        response: response
                    });
                });
            });
        })
    },

    editUser(user, res) {
        this.findUser('_id', user._id, res, (userById) => {

            if (user.newName) {
                this.findUser('name', user.newName, res, (userByNewName) => {
                    if (userByNewName) {
                        return res.status(409).json({
                            success: false,
                            code: "UserNameExistException",
                            message: "Username is already taken."
                        });
                    }

                    userById.name = user.newName;
                    userById.save(saveError => {
                        if (saveError) {
                            return res.status(500).json({
                                success: false,
                                code: "SaveUserNameException",
                                message: "Save changed user name failed.",
                                error: saveError
                            });
                        }

                        return res.status(201).json({
                            success: true,
                            message: "User name changed successfully",
                            user: userById
                        });
                    });
                });
            }

            if (user.email) {
                this.findUser('email', user.email, res, (userByEmail) => {
                    if (userByEmail) {
                        return res.status(409).json({
                            success: false,
                            code: "UserEmailExistException",
                            message: "E-Mail is already taken"
                        });
                    }

                    this.sendChangeEmailVerificationCode(userById, res);
                });
            }

            if (user.password) {
                userById.password = user.password;
                userById.save((saveError, savedUser) => {
                    if (saveError) {
                        res.status(500).json({
                            success: false,
                            code: "SaveUserPasswordException",
                            message: "Save changed user password failed.",
                            error: saveError
                        });
                    }

                    res.status(201).json({
                        success: true,
                        message: "User password changed successfully",
                        user: savedUser
                    });
                });
            }

            if (user.progress) {
                userById.progress = user.progress;
                userById.save((saveError, savedUser) => {
                    if (saveError) {
                        return res.status(500).json({
                            success: false,
                            code: "SaveUserProgressException",
                            message: "Save changed user progress failed.",
                            error: saveError
                        });
                    }

                    return res.status(201).json({
                        success: true,
                        message: "User progress changed successfully",
                        user: savedUser
                    });
                });
            }
        });
    },

    sendVerificationCode(newUser, res) {
        tokenService.generateVerificationToken(newUser, res, (token) => {
            const mailOptions = {
                from: 'no-reply@example.com',
                to: newUser.email,
                subject: 'Ihre Anmeldung auf fachentwickler',
                text: 'xxx',
                html: verificationMail.html(newUser, token)
            };

            mailService.sendMail(mailOptions, res,(response) => {
                const jwtToken = tokenService.signToken(newUser);

                return res.status(201).json({
                    success: true,
                    message: 'A verification link has been sent to ' + newUser.email + '. It will be expire after 24 hours.',
                    user: newUser,
                    token: jwtToken,
                    response: response
                });
            });
        });
    },

    sendChangeEmailVerificationCode(newUser, res) {
        tokenService.generateVerificationToken(newUser, res, (token) => {
            const mailOptions = {
                from: 'no-reply@example.com',
                to: newUser.email,
                subject: 'E-Mail Adresse ändern',
                text: 'xxx',
                html: changeEmail.html(newUser, token)
            };

            mailService.sendMail(mailOptions, res,(response) => {
                const jwtToken = tokenService.signToken(newUser);

                return res.status(201).json({
                    success: true,
                    message: 'A verification link has been sent to ' + newUser.email + '. It will be expire after 24 hours.',
                    user: newUser,
                    token: jwtToken,
                    response: response
                });
            });
        });
    },

    confirmUser(code, email, res, newEmail = null) {
        VerificationToken.findOne({ code: code }, (err, token) => {
            if (!token) {
                return res.status(400).send({
                    success: false,
                    code: "TokenNotFoundException",
                    message: 'Verification Token not found or may have expired.'
                });
            }

            this.findUser('_id', token._userId, res, async (userById) => {
                if (userById.active === true && newEmail !== null) {
                    userById.email = newEmail;
                    userById.save(async (saveError, savedUser) => {
                        if (saveError) {
                            res.status(500).json({
                                success: false,
                                code: "SaveUserEmailException",
                                message: "Save changed user e-mail failed.",
                                error: saveError
                            });
                        }

                        await tokenService.deleteToken('code', token.code, res, (response) => {
                            return res.status(200).send({
                                success: true,
                                message: 'User E-Mail changed successfully.',
                                response: response,
                                user: savedUser
                            });
                        });
                    });
                } else if (userById.active === true) {
                    return res.status(200).send({
                        success: false,
                        code: "UserVerifiedException",
                        message: 'User is already verified.',
                        error: err
                    });
                } else {
                    userById.active = true;
                    userById.save(async (saveError, savedUser) => {
                        if (saveError) {
                            return res.status(500).send({
                                success: false,
                                code: "SaveVerifiedUserException",
                                message: 'Save verified user failed.',
                                error: saveError
                            });
                        }

                        await tokenService.deleteToken('code', token.code, res, (response) => {
                            return res.status(200).send({
                                success: true,
                                message: 'User verified successfully.',
                                response: response
                            });
                        });
                    });
                }
            });
        });
    },

    changePassword(code, newPassword, res) {
        VerificationToken.findOne({ code: code }, (err, token) => {
            if (!token) {
                return res.status(400).send({
                    success: false,
                    code: "TokenNotFoundException",
                    message: 'Verification Token not found or may have expired.'
                });
            }

            this.findUser('_id', token._userId, res, async (userById) => {
                userById.password = newPassword;
                userById.save((saveError, savedUser) => {
                    if (saveError) {
                        res.status(500).json({
                            success: false,
                            code: "SaveNewPasswordException",
                            message: "Save changed user password failed.",
                            error: saveError
                        });
                    }

                    tokenService.deleteToken('code', token.code, res, (response) => {
                        return res.status(200).send({
                            success: true,
                            message: 'User password changed successfully.',
                            response: response,
                            user: savedUser
                        });
                    });
                });
            });
        });
    }
}
