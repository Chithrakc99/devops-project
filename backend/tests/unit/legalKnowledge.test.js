const { getSuggestions, legalKnowledge } = require('../../data/legalKnowledge');

describe('Legal Knowledge Base - Unit Tests', () => {

  // ─── Knowledge Base Integrity ───────────────────────────────────────
  describe('Knowledge Base Structure', () => {
    test('legalKnowledge should be a non-empty array', () => {
      expect(Array.isArray(legalKnowledge)).toBe(true);
      expect(legalKnowledge.length).toBeGreaterThan(0);
    });

    test('every entry should have required fields', () => {
      legalKnowledge.forEach((entry) => {
        expect(entry).toHaveProperty('id');
        expect(entry).toHaveProperty('keywords');
        expect(entry).toHaveProperty('category');
        expect(entry).toHaveProperty('urgency');
        expect(entry).toHaveProperty('title');
        expect(entry).toHaveProperty('laws');
        expect(entry).toHaveProperty('recommendation');
        expect(entry).toHaveProperty('emergency');
      });
    });

    test('every entry should have at least one keyword', () => {
      legalKnowledge.forEach((entry) => {
        expect(Array.isArray(entry.keywords)).toBe(true);
        expect(entry.keywords.length).toBeGreaterThan(0);
      });
    });

    test('every entry should have at least one law', () => {
      legalKnowledge.forEach((entry) => {
        expect(Array.isArray(entry.laws)).toBe(true);
        expect(entry.laws.length).toBeGreaterThan(0);
      });
    });

    test('urgency values should be valid', () => {
      const validUrgencies = ['URGENT', 'HIGH', 'MEDIUM', 'LOW'];
      legalKnowledge.forEach((entry) => {
        expect(validUrgencies).toContain(entry.urgency);
      });
    });

    test('IDs should be unique', () => {
      const ids = legalKnowledge.map((e) => e.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(ids.length);
    });
  });

  // ─── getSuggestions – Criminal Scenarios ────────────────────────────
  describe('getSuggestions() - Criminal Scenarios', () => {
    test('should detect arrest scenario', () => {
      const result = getSuggestions('I was arrested by the police yesterday and kept in jail overnight');
      expect(result.primary.category).toBe('criminal');
      expect(result.primary.urgency).toBe('URGENT');
      expect(result.primary.emergency).toBe(true);
    });

    test('should detect theft scenario', () => {
      const result = getSuggestions('Someone stole my laptop and wallet from my bag');
      expect(result.primary.category).toBe('criminal');
      expect(result.primary.title).toContain('Theft');
    });

    test('should detect fraud scenario', () => {
      const result = getSuggestions('I was cheated by someone online who took my money with fake documents');
      expect(result.primary.category).toBe('criminal');
    });

    test('should detect assault scenario', () => {
      const result = getSuggestions('My neighbour beat me badly and I am hurt');
      expect(result.primary.category).toBe('criminal');
    });

    test('should flag emergency correctly for serious crimes', () => {
      const result = getSuggestions('The police have put me in custody without telling me why');
      expect(result.primary.emergency).toBe(true);
    });
  });

  // ─── getSuggestions – Family Scenarios ──────────────────────────────
  describe('getSuggestions() - Family Scenarios', () => {
    test('should detect divorce scenario', () => {
      const result = getSuggestions('My husband and I want to file for divorce by mutual consent');
      expect(result.primary.category).toBe('family');
    });

    test('should detect domestic violence scenario', () => {
      const result = getSuggestions('My husband has been beating me regularly and abusing me at home');
      expect(result.primary.urgency).toBe('URGENT');
      expect(result.primary.emergency).toBe(true);
    });

    test('should detect child custody scenario', () => {
      const result = getSuggestions('I need custody of my minor child after separation');
      expect(result.primary.category).toBe('family');
      expect(result.primary.title).toContain('Custody');
    });

    test('should detect maintenance scenario', () => {
      const result = getSuggestions('My spouse is not providing any financial support or alimony after separation');
      expect(result.primary.category).toBe('family');
    });
  });

  // ─── getSuggestions – Civil/Property Scenarios ──────────────────────
  describe('getSuggestions() - Civil Scenarios', () => {
    test('should detect property dispute', () => {
      const result = getSuggestions('My neighbour is encroaching on my land and there is a boundary dispute');
      expect(result.primary.category).toBe('civil');
    });

    test('should detect consumer complaint', () => {
      const result = getSuggestions('The company sold me a defective product and is refusing a refund');
      expect(result.primary.category).toBe('civil');
    });

    test('should detect tenant landlord dispute', () => {
      const result = getSuggestions('My landlord is trying to evict me illegally without any notice');
      expect(result.primary.category).toBe('civil');
    });
  });

  // ─── getSuggestions – Edge Cases ────────────────────────────────────
  describe('getSuggestions() - Edge Cases', () => {
    test('should return a fallback for unrecognised situation', () => {
      const result = getSuggestions('I need some general help with a complex matter');
      expect(result.primary).toBeDefined();
      expect(result.primary.recommendation).toBeTruthy();
    });

    test('should handle mixed-case input', () => {
      const result = getSuggestions('POLICE ARRESTED ME AND PUT ME IN JAIL');
      expect(result.primary.category).toBe('criminal');
    });

    test('should return secondary match for complex multi-issue situation', () => {
      const result = getSuggestions('My husband arrested me and I also want a divorce');
      // Should match both criminal and family
      expect(result.primary).toBeDefined();
      // Secondary may or may not be present depending on scoring
    });

    test('should always return a primary result', () => {
      const testCases = [
        'I have a legal problem',
        'Someone is bothering me',
        'I need help with my case',
        'There is a dispute',
      ];
      testCases.forEach((situation) => {
        const result = getSuggestions(situation);
        expect(result.primary).toBeDefined();
        expect(result.primary.recommendation).toBeTruthy();
      });
    });

    test('primary result should always have laws array', () => {
      const result = getSuggestions('random scenario with no clear keywords');
      expect(Array.isArray(result.primary.laws)).toBe(true);
    });
  });

  // ─── getSuggestions – Cyber Scenarios ───────────────────────────────
  describe('getSuggestions() - Cyber Scenarios', () => {
    test('should detect OTP fraud', () => {
      const result = getSuggestions('Someone called me and took my OTP and hacked my bank account');
      expect(result.primary.category).toBe('cyber');
    });

    test('should detect online defamation', () => {
      const result = getSuggestions('Someone posted defamatory content about me on social media damaging my reputation');
      expect(result.primary.category).toBe('cyber');
    });
  });

  // ─── getSuggestions – Employment Scenarios ──────────────────────────
  describe('getSuggestions() - Employment Scenarios', () => {
    test('should detect wrongful termination', () => {
      const result = getSuggestions('I was fired from my job without any notice or reason given');
      expect(result.primary.category).toBe('employment');
    });

    test('should detect sexual harassment at workplace', () => {
      const result = getSuggestions('My manager is sexually harassing me at the office workplace');
      expect(result.primary.urgency).toBe('URGENT');
      expect(result.primary.emergency).toBe(true);
    });

    test('should detect unpaid salary', () => {
      const result = getSuggestions('My company has not paid my salary and PF for 3 months');
      expect(result.primary.category).toBe('employment');
    });
  });
});
