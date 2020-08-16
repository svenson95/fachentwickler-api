const mongoose = require('mongoose');

const connection = mongoose.createConnection(process.env.DB_CONNECTION_SCHOOLBASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const SubstitutionSchedule = connection.model('substitution-schedule', new mongoose.Schema({
    timestamp: { type: String, required: true },
    department: { type: String, required: true },
    today: {
        weekday: { type: String },
        day: { type: String },
        week: { type: String },
        schoolWeek: { type: String },
        turnus: { type: String },
        turnusWeek: { type: String },
        classes: { type: Map, of: Map }
    },
    tomorrow: {
        weekday: { type: String },
        day: { type: String },
        week: { type: String },
        schoolWeek: { type: String },
        turnus: { type: String },
        turnusWeek: { type: String },
        classes: { type: Map, of: Map }
    }
}));

module.exports = SubstitutionSchedule;
