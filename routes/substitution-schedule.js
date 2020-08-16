const express = require('express');
const router = express.Router();
const SubstitutionSchedule = require('../models/substitution-schedule/Substitution-Schedule');

// Get substitution schedule for all classes
router.get('/', async (req, res) => {
    try {
        const classSchedule = await SubstitutionSchedule.find();
        res.json(classSchedule);
    } catch (error) {
        res.json({ error: true, message: error });
    }
});

// Get substitution schedule for specific class
router.get('/:className', async (req, res) => {
    const className = req.params.className;
    try {
        const classSchedule = await SubstitutionSchedule.find()[0];
        const scheduleObject = {
            timestamp: classSchedule.timestamp,
            department: classSchedule.department,
            today: {
                weekday: classSchedule.today.weekday,
                day: classSchedule.today.day,
                week: classSchedule.today.week,
                schoolWeek: classSchedule.today.schoolWeek,
                turnus: classSchedule.today.turnus,
                turnusWeek: classSchedule.today.turnusWeek,
                substitutions: classSchedule.today.classes[className]
            },
            tomorrow: {
                weekday: classSchedule.today.weekday,
                day: classSchedule.today.day,
                week: classSchedule.today.week,
                schoolWeek: classSchedule.today.schoolWeek,
                turnus: classSchedule.today.turnus,
                turnusWeek: classSchedule.today.turnusWeek,
                substitutions: classSchedule.tomorrow.classes[className]
            }
        };
        res.json(scheduleObject);
    } catch (error) {
        res.json({ error: true, message: error });
    }
});

// Submit new substitution schedule
router.post('/upload', async (req, res) => {

    const substitutionSchedule = new SubstitutionSchedule(req.body);

    try {
        await substitutionSchedule.save();
        res.json({ substitutionSchedule });
    } catch (error) {
        res.json({ message: error, error: true });
    }
});

module.exports = router;
