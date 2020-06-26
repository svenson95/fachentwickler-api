const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Progress = require('./Progress');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 4,
        max: 15
    },
    email: {
        type: String,
        min: 4,
        max: 20
    },
    password : {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'teacher'],
        required: true
    },
    progress: [{ type: mongoose.Schema.Types.ObjectId, ref: Progress }]
});

// function(next) as arrow function not work, no access to 'this'
UserSchema.pre('save', function(next) {
    if (!this.isModified('password'))   // its already hashed
        return next();
    bcrypt.hash(this.password, 10, (err, passwordHash) => {
        if (err)
            return next(err);
        this.password = passwordHash;
        next();
    });

});

UserSchema.methods.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err)
            return callback(err);
        else
            if (!isMatch)
                return callback(null, isMatch);
            return callback(null, this);    // this is the user object
    })
};

const connection = mongoose.createConnection(process.env.DB_CONNECTION_SCHOOLUSERS, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const User = connection.model('users', UserSchema);

module.exports = User;
