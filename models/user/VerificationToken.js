const mongoose = require('mongoose');

const VerificationTokenSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    code : { type: String, required: true },
    expire_at: { type: Date, default: new Date().getTime(), expires: 86400000 }
});
VerificationTokenSchema.index({ "expire_at": 1 }, { expireAfterSeconds: 60 });

const connection = mongoose.createConnection(process.env.DB_CONNECTION_SCHOOLUSERS, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const VerificationToken = connection.model('verification-token', VerificationTokenSchema);

module.exports = VerificationToken;
