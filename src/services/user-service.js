const VerificationToken = require('../models/user/VerificationToken');
const User = require('../models/user/User');

const tokenService = require('./token-service');
const mailService = require('./mail-service');
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
                    message: "Find user by '" + key + ": " + value + "' failed.",
                    error: error
                });
            }

            callback(user);
        });
    },

    saveUser(user, res, callback) {
        User.save({ '_id': user._id }, (error, user) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    code: "SaveUserException",
                    message: "Save user '" + user.name + "' failed.",
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
                        return res.status(400).json({
                            success: false,
                            code: "SaveNewUserException",
                            message: "Save new user failed.",
                            error: err
                        });
                    }

                    this.sendRegisterVerificationCode(createdUser, res);
                });
            })
        });
    },

    forgotPassword(email, res) {
        this.findUser('email', email, res, (userByEmail) => {
            if (!userByEmail) {
                return res.status(400).json({
                    success: false,
                    code: 'UserNotFoundException',
                    message: 'User with e-mail \'' + email + '\' not found'
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

                mailService.sendMail(mailOptions, res, (response) => {
                    const jwtToken = tokenService.signToken(userByEmail);

                    return res.status(201).json({
                        success: true,
                        message: 'A verification link has been sent to ' + userByEmail.email + '. It will be expire after 24 hours.',
                        user: userByEmail,
                        token: jwtToken
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

            if (user.theme) {
                userById.theme = user.theme;
                userById.save((saveError, savedUser) => {
                    if (saveError) {
                        return res.status(500).json({
                            success: false,
                            code: "SaveUserProgressException",
                            message: "Save changed user theme failed.",
                            error: saveError
                        });
                    }

                    return res.status(201).json({
                        success: true,
                        message: "User theme changed successfully",
                        user: savedUser
                    });
                });
            }
        });
    },

    sendRegisterVerificationCode(newUser, res) {
        tokenService.generateVerificationToken(newUser, res, (token) => {
            const mailOptions = {
                from: 'no-reply@example.com',
                to: newUser.email,
                subject: 'Ihre Anmeldung auf fachentwickler',
                text: 'xxx',
                html: verificationMail.html(newUser, token)
            };

            mailService.sendMail(mailOptions, res, (response) => {
                const jwtToken = tokenService.signToken(newUser);

                return res.status(201).json({
                    success: true,
                    message: 'Verification code has been sent to ' + newUser.email + '. It will be expire after 24 hours.',
                    token: jwtToken
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

            mailService.sendMail(mailOptions, res, (response) => {
                const jwtToken = tokenService.signToken(newUser);

                return res.status(201).json({
                    success: true,
                    message: 'A verification link has been sent to ' + newUser.email + '. It will be expire after 24 hours.',
                    user: newUser,
                    token: jwtToken
                });
            });
        });
    },

    verifyUser(code, email, res, newEmail = null) {
        VerificationToken.findOne({ code: code }, (err, token) => {
            if (!token) {
                return res.status(400).send({
                    success: false,
                    code: "TokenNotFoundException",
                    message: 'Verification Token not found or may have expired.'
                });
            }

            this.findUser('_id', token._userId, res, async (userById) => {
                if (userById.active !== true) {
                    userById.active = true;
                    this.saveUser(userById, res, (user) => {
                        tokenService.deleteToken('code', token.code, res, (response) => {
                            return res.status(200).send({
                                success: true,
                                message: 'User verified successfully.',
                                user: user
                            });
                        });
                    });
                } else if (userById.active === true && newEmail !== null) {
                    userById.email = newEmail;
                    this.saveUser(userById, res, (user) => {
                        tokenService.deleteToken('code', token.code, res, (response) => {
                            return res.status(200).send({
                                success: true,
                                message: 'User E-Mail changed successfully.',
                                user: user
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
            } else if (err) {
                return res.status(500).send({
                    success: false,
                    code: "FindTokenException",
                    message: 'Error occured while find verification token.',
                    error: err
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
                            message: 'User password changed successfully.'
                        });
                    });
                });
            });
        });
    }
}
