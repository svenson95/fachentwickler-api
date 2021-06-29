const mongoose = require('mongoose');

const expireDate = () => {
    const now = new Date();
    return now.setTime(now.getTime() + 86400000);
}

const VerificationTokenSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    code: { type: String, required: true },
    expire_at: { type: Date, default: expireDate() }
});
VerificationTokenSchema.index({ expire_at: 1 }, { expiresAfterSeconds: 86400000 })

const connection = mongoose.createConnection(process.env.DB_CONNECTION_SCHOOLUSERS, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const VerificationToken = connection.model('verification-token', VerificationTokenSchema);

module.exports = VerificationToken;
