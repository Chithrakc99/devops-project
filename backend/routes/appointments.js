const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Get all lawyers (For user to select)
router.get('/lawyers', async (req, res) => {
    try {
        const lawyers = await User.find({ role: 'lawyer' }).select('-password');
        res.json(lawyers);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Book an appointment (User)
router.post('/book', async (req, res) => {
    try {
        const { userId, lawyerId, description } = req.body;
        // Check if one already exists
        const existing = await Appointment.findOne({ 
            userId, lawyerId, status: { $in: ['pending', 'accepted'] } 
        });
        if (existing) {
            return res.status(400).json({ msg: 'You already have an active appointment with this lawyer' });
        }

        const appointment = new Appointment({ userId, lawyerId, description });
        await appointment.save();
        res.status(201).json({ msg: 'Appointment booked successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// View appointments (Lawyer or User)
router.get('/:userId/:role', async (req, res) => {
    try {
        const { userId, role } = req.params;
        let query = {};
        if (role === 'lawyer') {
            query.lawyerId = userId;
        } else {
            query.userId = userId;
        }
        const appointments = await Appointment.find(query).populate('userId', 'name email').populate('lawyerId', 'name email domain').sort({ createdAt: -1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Accept / Reject / Cancel an appointment
router.put('/:id/status', async (req, res) => {
    try {
        const { status, quotePrice, appointmentDate } = req.body; 
        const updateData = { status };
        if (quotePrice !== undefined) {
            updateData.quotePrice = quotePrice;
        }
        if (appointmentDate !== undefined) {
            updateData.appointmentDate = appointmentDate;
        }
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' });
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Delete cancelled appointment
router.delete('/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });
        if (appointment.status !== 'cancelled') {
            return res.status(400).json({ msg: 'Only cancelled appointments can be deleted' });
        }
        await appointment.deleteOne();
        res.json({ msg: 'Appointment deleted successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
