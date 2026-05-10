const express = require('express');
const router = express.Router();
const { getSuggestions } = require('../data/legalKnowledge');

/**
 * POST /api/suggestions
 * Body: { situation: string }
 * Returns structured legal suggestions using the RAG-based knowledge base.
 */
router.post('/', async (req, res) => {
  try {
    const { situation } = req.body;

    if (!situation || situation.trim().length < 10) {
      return res.status(400).json({ msg: 'Please provide a detailed description of your situation (at least 10 characters).' });
    }

    const { primary, secondary } = getSuggestions(situation);

    const response = {
      primary: {
        title: primary.title,
        category: primary.category,
        urgency: primary.urgency,
        laws: primary.laws,
        recommendation: primary.recommendation,
        emergency: primary.emergency,
      },
    };

    if (secondary) {
      response.secondary = {
        title: secondary.title,
        category: secondary.category,
        urgency: secondary.urgency,
        laws: secondary.laws,
        recommendation: secondary.recommendation,
        emergency: secondary.emergency,
      };
    }

    res.json(response);
  } catch (err) {
    console.error('Suggestion error:', err);
    res.status(500).json({ msg: 'Server error while processing suggestion.' });
  }
});

module.exports = router;
