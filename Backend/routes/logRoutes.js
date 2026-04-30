const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const authMiddleware = require('../middleware/auth');

// ADD LOG
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { crop, expense, profit, irrigationDate, sprayDate, notes } = req.body;

        const log = await Log.create({
            crop,
            expense,
            profit,
            irrigationDate,
            sprayDate,
            notes,
            userId: req.user.id
        });

        res.json(log);

    } catch (err) {
        res.status(500).json(err);
    }
});

// GET USER LOGS
router.get('/', authMiddleware, async (req, res) => {
    try {
        const logs = await Log.findAll({
            where: { userId: req.user.id }
        });

        res.json(logs);

    } catch (err) {
        res.status(500).json(err);
    }
});

// delete log
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Log.destroy({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        res.json({ message: "Deleted successfully" });

    } catch (err) {
        res.status(500).json(err);
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { crop, expense, profit } = req.body;

        await Log.update(
            { crop, expense, profit },
            {
                where: {
                    id: req.params.id,
                    userId: req.user.id
                }
            }
        );

        res.json({ message: "Updated" });

    } catch (err) {
        res.status(500).json(err);
    }
});
module.exports = router;