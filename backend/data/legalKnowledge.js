/**
 * Comprehensive Indian Legal Knowledge Base
 * Used for keyword-based RAG (Retrieval-Augmented Generation) suggestions.
 * Each entry contains: keywords, category, urgency, relevant laws, and recommendations.
 */

const legalKnowledge = [
  // ─── CRIMINAL LAW ────────────────────────────────────────────────────
  {
    id: 'crim-001',
    keywords: ['arrest', 'arrested', 'police', 'jail', 'custody', 'detained', 'fir', 'first information report', 'lockup'],
    category: 'criminal',
    urgency: 'URGENT',
    title: 'Arrest / Police Custody',
    laws: [
      { section: 'Section 41 CrPC', description: 'Specifies grounds under which police can arrest without a warrant.' },
      { section: 'Section 50 CrPC', description: 'Police must communicate the grounds of arrest to the arrested person.' },
      { section: 'Section 56–57 CrPC', description: 'Person arrested must be produced before a Magistrate within 24 hours.' },
      { section: 'Article 22, Constitution', description: 'Fundamental right: right to be informed of grounds of arrest and right to legal counsel.' },
      { section: 'D.K. Basu Guidelines (SC)', description: 'Supreme Court mandated guidelines for lawful arrest – memo, relative intimation, medical exam.' },
    ],
    recommendation: 'You have the right to remain silent – do NOT make any statement without a lawyer present. Demand to know the grounds of your arrest (Section 50 CrPC). You MUST be produced before a Magistrate within 24 hours (excluding travel time). Immediately request to contact a family member or lawyer. If bailable, apply for bail immediately. Document any visible injuries for potential police brutality claims.',
    emergency: true,
  },
  {
    id: 'crim-002',
    keywords: ['bail', 'bailable', 'non-bailable', 'anticipatory bail', 'regular bail', 'remand'],
    category: 'criminal',
    urgency: 'HIGH',
    title: 'Bail Application',
    laws: [
      { section: 'Section 436 CrPC', description: 'Bail as a right in bailable offences.' },
      { section: 'Section 437 CrPC', description: 'Bail in non-bailable offences (Magistrate\'s court).' },
      { section: 'Section 438 CrPC', description: 'Anticipatory bail – protection from arrest in apprehended cases.' },
      { section: 'Section 439 CrPC', description: 'High Court and Sessions Court power to grant bail.' },
    ],
    recommendation: 'If the offence is bailable, you have an absolute right to bail. For non-bailable offences, approach a Sessions Court or High Court. For anticipatory bail (if you fear arrest), apply under Section 438 CrPC before arrest. A lawyer specialising in criminal law can draft the bail application citing good conduct, roots in the community, and unlikelihood of flight risk.',
    emergency: false,
  },
  {
    id: 'crim-003',
    keywords: ['murder', 'attempt to murder', 'killed', 'homicide', 'death', 'ipc 302', 'section 302'],
    category: 'criminal',
    urgency: 'URGENT',
    title: 'Homicide / Murder',
    laws: [
      { section: 'Section 302 IPC', description: 'Punishment for murder – death penalty or life imprisonment.' },
      { section: 'Section 304 IPC', description: 'Culpable homicide not amounting to murder.' },
      { section: 'Section 307 IPC', description: 'Attempt to murder – imprisonment up to 10 years.' },
      { section: 'Section 299 IPC', description: 'Defines culpable homicide.' },
    ],
    recommendation: 'This is a capital offence. If you are a victim\'s family: file an FIR immediately. If you are accused: exercise your right to silence and demand legal counsel immediately. Cooperate with forensic evidence preservation. A Sessions Court trial will be mandatory. Engage an experienced criminal defence lawyer.',
    emergency: true,
  },
  {
    id: 'crim-004',
    keywords: ['assault', 'attack', 'beat', 'beaten', 'hurt', 'grievous hurt', 'physical violence', 'bully', 'fight'],
    category: 'criminal',
    urgency: 'HIGH',
    title: 'Assault / Physical Harm',
    laws: [
      { section: 'Section 319–321 IPC', description: 'Hurt and Grievous Hurt – fines and imprisonment.' },
      { section: 'Section 323 IPC', description: 'Punishment for voluntarily causing hurt (up to 1 year).' },
      { section: 'Section 325 IPC', description: 'Punishment for voluntarily causing grievous hurt (up to 7 years).' },
      { section: 'Section 351 IPC', description: 'Definition of assault.' },
    ],
    recommendation: 'Seek medical attention immediately and get a medico-legal certificate (MLC) from a government hospital. File an FIR with the police (must accept under Section 154 CrPC). Photograph all injuries. Collect witness statements. Engage a criminal lawyer to file a Section 200 CrPC complaint before a Magistrate if police refuse FIR.',
    emergency: false,
  },
  {
    id: 'crim-005',
    keywords: ['theft', 'stolen', 'stole', 'robbery', 'dacoity', 'burglary', 'pickpocket', 'snatching'],
    category: 'criminal',
    urgency: 'MEDIUM',
    title: 'Theft / Robbery',
    laws: [
      { section: 'Section 378 IPC', description: 'Definition of theft.' },
      { section: 'Section 379 IPC', description: 'Punishment for theft – up to 3 years.' },
      { section: 'Section 390–392 IPC', description: 'Robbery – up to 10 years rigorous imprisonment.' },
      { section: 'Section 395 IPC', description: 'Dacoity – up to life imprisonment.' },
    ],
    recommendation: 'File an FIR immediately with local police. Provide a complete list of stolen items with serial numbers and estimated value. If robbery involved a weapon, emphasise this for enhanced charges. Report credit/debit card theft to your bank immediately. For cyber theft, also file a complaint with the Cyber Crime Cell.',
    emergency: false,
  },
  {
    id: 'crim-006',
    keywords: ['fraud', 'cheating', 'scam', 'forgery', 'fake', 'misrepresentation', 'deceive', 'duped'],
    category: 'criminal',
    urgency: 'MEDIUM',
    title: 'Fraud / Cheating',
    laws: [
      { section: 'Section 415 IPC', description: 'Definition of cheating.' },
      { section: 'Section 420 IPC', description: 'Cheating and dishonestly inducing delivery of property – up to 7 years.' },
      { section: 'Section 463–468 IPC', description: 'Forgery and its punishment – up to 7 years.' },
      { section: 'IT Act Section 66C & 66D', description: 'Identity theft and cheating by personation using computer resources.' },
    ],
    recommendation: 'Preserve all documentary evidence (messages, emails, receipts, contracts, bank statements). File an FIR under Section 420 IPC. For cyber fraud, file at Cyber Crime portal (cybercrime.gov.in). A lawyer can also file a civil recovery suit simultaneously. Keep records of all financial transactions.',
    emergency: false,
  },

  // ─── FAMILY LAW ──────────────────────────────────────────────────────
  {
    id: 'fam-001',
    keywords: ['divorce', 'separation', 'marriage break', 'matrimonial', 'spouse', 'husband left', 'wife left', 'mutual consent'],
    category: 'family',
    urgency: 'MEDIUM',
    title: 'Divorce / Matrimonial Disputes',
    laws: [
      { section: 'Section 13 Hindu Marriage Act, 1955', description: 'Grounds for divorce (cruelty, adultery, desertion, etc.).' },
      { section: 'Section 13B Hindu Marriage Act', description: 'Divorce by mutual consent – requires 6 months cooling-off period.' },
      { section: 'Special Marriage Act, 1954', description: 'Divorce for inter-faith or civil marriages.' },
      { section: 'Section 125 CrPC', description: 'Maintenance for wife, children and parents.' },
    ],
    recommendation: 'Identify the grounds for divorce: mutual consent (faster, 6–18 months) or contested (cruelty, desertion, adultery, etc.). Gather marriage certificate, proof of matrimonial home, financial documents, and evidence of any abuse. Apply for interim maintenance and residence protection immediately if needed. A family court lawyer can guide on Section 9 (Restitution of Conjugal Rights) if reconciliation is sought.',
    emergency: false,
  },
  {
    id: 'fam-002',
    keywords: ['child custody', 'custody', 'child', 'minor child', 'guardianship', 'visitation'],
    category: 'family',
    urgency: 'HIGH',
    title: 'Child Custody / Guardianship',
    laws: [
      { section: 'Guardians and Wards Act, 1890', description: 'Comprehensive law on guardianship of minors.' },
      { section: 'Section 26 Hindu Marriage Act', description: 'Custody of children during divorce proceedings.' },
      { section: 'Section 6 Hindu Minority and Guardianship Act, 1956', description: 'Natural guardians – father and mother both have rights.' },
      { section: 'Article 13 Hague Convention', description: 'International child abduction standards applicable to India.' },
    ],
    recommendation: 'The paramount consideration is the "best interests of the child". Courts consider the child\'s age, gender, welfare, education, and expressed wishes (if old enough). File for interim custody immediately if the child is at risk. A psychologist\'s report may help. Joint custody is increasingly favoured by Indian courts. Keep records of your involvement in the child\'s education, health, and daily care.',
    emergency: false,
  },
  {
    id: 'fam-003',
    keywords: ['domestic violence', 'domestic abuse', 'husband beating', 'wife beating', 'beating me', 'abusing me', 'DV act', 'cruelty', 'matrimonial cruelty', 'abuse at home', 'abusing'],
    category: 'family',
    urgency: 'URGENT',
    title: 'Domestic Violence',
    laws: [
      { section: 'Protection of Women from DV Act, 2005', description: 'Broad protection: physical, emotional, sexual, economic abuse.' },
      { section: 'Section 498A IPC', description: 'Cruelty by husband or relatives – up to 3 years imprisonment.' },
      { section: 'Section 12 PWDVA', description: 'Application to Magistrate for protection order, residence order, custody.' },
      { section: 'Section 18–23 PWDVA', description: 'Relief orders: protection, residence, monetary, compensation.' },
    ],
    recommendation: 'Your immediate safety is the priority – leave the premises if unsafe. Contact the National DV Helpline: 181 or 1091 (Women). Visit a Government hospital for a medico-legal certificate documenting injuries. Apply for a Protection Order under PWDVA – this can be done through a Protection Officer or directly at a Magistrate\'s court. Also file an FIR under Section 498A IPC for cruelty. A shelter home can be arranged by the District Women & Child Development office.',
    emergency: true,
  },
  {
    id: 'fam-004',
    keywords: ['maintenance', 'alimony', 'financial support', 'spouse support', 'child support', 'not providing money'],
    category: 'family',
    urgency: 'MEDIUM',
    title: 'Maintenance / Alimony',
    laws: [
      { section: 'Section 125 CrPC', description: 'Maintenance for wife, children, and parents who cannot maintain themselves.' },
      { section: 'Section 24–25 HMA', description: 'Maintenance pendente lite and permanent alimony under Hindu Marriage Act.' },
      { section: 'Section 36–37 Special Marriage Act', description: 'Maintenance provisions for special marriages.' },
      { section: 'Muslim Women Protection Act, 1986', description: 'Maintenance for Muslim women on divorce.' },
    ],
    recommendation: 'File an application under Section 125 CrPC in the nearest Magistrate\'s Court (all religions). You can also apply for interim maintenance which the court can grant quickly. Gather evidence of your income/lack thereof and the spouse\'s income (salary slips, IT returns, bank statements). The court typically awards 1/4 to 1/3 of the spouse\'s net income as maintenance.',
    emergency: false,
  },

  // ─── CIVIL / PROPERTY LAW ────────────────────────────────────────────
  {
    id: 'civ-001',
    keywords: ['property dispute', 'land dispute', 'encroachment', 'illegal possession', 'property stolen', 'trespass', 'boundary dispute'],
    category: 'civil',
    urgency: 'MEDIUM',
    title: 'Property / Land Dispute',
    laws: [
      { section: 'Transfer of Property Act, 1882', description: 'Governs sale, mortgage, lease, and exchange of property.' },
      { section: 'Section 5–6 Specific Relief Act', description: 'Recovery of possession of immovable property.' },
      { section: 'Section 145–147 CrPC', description: 'Magistrate can restrain dispute over possession of land.' },
      { section: 'Section 441 IPC', description: 'Criminal trespass – up to 3 months imprisonment or fine.' },
      { section: 'RERA Act, 2016', description: 'Protects buyers of real estate from builders.' },
    ],
    recommendation: 'Gather all title documents (sale deed, 7/12 extract, mutation records, Patta). File a civil suit for declaration of title and permanent injunction in the civil court of the district where the property is located. For immediate relief, apply for a temporary injunction under Order XXXIX, Rules 1 & 2 of CPC. If criminal trespass is involved, file an FIR under Section 441 IPC. For builder disputes, file a complaint with RERA.',
    emergency: false,
  },
  {
    id: 'civ-002',
    keywords: ['contract breach', 'agreement broken', 'contract violation', 'breach of contract', 'signed agreement', 'mou', 'memorandum'],
    category: 'civil',
    urgency: 'MEDIUM',
    title: 'Breach of Contract',
    laws: [
      { section: 'Section 73 Indian Contract Act, 1872', description: 'Compensation for breach of contract.' },
      { section: 'Section 74 Indian Contract Act', description: 'Liquidated damages and penalties.' },
      { section: 'Specific Relief Act, 1963', description: 'Court can enforce specific performance of a contract.' },
      { section: 'Limitation Act, 1963', description: '3 years limitation for breach of contract suits.' },
    ],
    recommendation: 'Preserve the original contract/agreement and all correspondence. Send a formal legal notice under Section 80 CPC (for government) or a lawyer\'s notice for private parties, demanding performance or compensation within 30 days. If unresolved, file a civil suit in the appropriate court. For commercial disputes above ₹1 Cr, approach a Commercial Court. Arbitration may be preferred if the contract has an arbitration clause.',
    emergency: false,
  },
  {
    id: 'civ-003',
    keywords: ['tenant', 'landlord', 'eviction', 'rent dispute', 'rental agreement', 'not paying rent', 'illegal eviction', 'rent increase'],
    category: 'civil',
    urgency: 'MEDIUM',
    title: 'Landlord-Tenant Dispute',
    laws: [
      { section: 'Rent Control Act (State-specific)', description: 'Most states have Rent Control Acts that protect tenants.' },
      { section: 'Transfer of Property Act, 1882', description: 'Governs the landlord-tenant relationship.' },
      { section: 'Section 106 TPA', description: 'Notice requirements for termination of lease.' },
      { section: 'Model Tenancy Act, 2021', description: 'New framework; notified for adoption by states.' },
    ],
    recommendation: 'Register your rental agreement (mandatory for agreements over 11 months in most states). For illegal eviction, file a complaint with the Rent Controller and apply for an injunction. For non-payment of rent by tenant, send a legal notice and then file an eviction petition before the Rent Court. Locks cannot be changed without a court order – this constitutes illegal eviction. Keep rent receipts safe.',
    emergency: false,
  },
  {
    id: 'civ-004',
    keywords: ['consumer', 'defective product', 'poor service', 'consumer complaint', 'consumer court', 'cheated by company', 'refund denied'],
    category: 'civil',
    urgency: 'LOW',
    title: 'Consumer Complaint',
    laws: [
      { section: 'Consumer Protection Act, 2019', description: 'Comprehensive consumer rights: right to be heard, redressal, and safety.' },
      { section: 'Section 35 CPA 2019', description: 'File complaint in District Consumer Commission (up to ₹1 Cr).' },
      { section: 'Section 47 CPA 2019', description: 'State Commission (₹1 Cr to ₹10 Cr).' },
      { section: 'E-Commerce Rules, 2020', description: 'Online platforms must have grievance redressal mechanism.' },
    ],
    recommendation: 'First, file a formal complaint with the company\'s grievance officer (mandatory under CPA 2019). If unresolved within 30 days, file a complaint with the District Consumer Commission. For online complaints, use the National Consumer Helpline: 1800-11-4000 or consumerhelpline.gov.in. No lawyer is required at the District level. Keep all bills, warranty cards, and correspondence.',
    emergency: false,
  },

  // ─── EMPLOYMENT LAW ──────────────────────────────────────────────────
  {
    id: 'emp-001',
    keywords: ['wrongful termination', 'fired', 'dismissed', 'sacked', 'layoff', 'retrenchment', 'job lost', 'terminated', 'without notice', 'fired from my job'],
    category: 'employment',
    urgency: 'MEDIUM',
    title: 'Wrongful Termination',
    laws: [
      { section: 'Industrial Disputes Act, 1947', description: 'Protection against unfair retrenchment for industrial workers.' },
      { section: 'Section 25F IDA', description: 'Conditions precedent to retrenchment: 1 month notice + compensation.' },
      { section: 'Standing Orders Act, 1946', description: 'Certified Standing Orders regulate employment conditions.' },
      { section: 'Section 27 IDA', description: 'No workman can be dismissed without due inquiry.' },
    ],
    recommendation: 'Request a written termination letter with stated reasons. If terminated without notice or pay-in-lieu, send a legal notice claiming dues. File a complaint with the Labour Commissioner for violations of IDA. For private sector employees, check your employment contract for termination clauses. Keep copies of all performance reviews and appraisals. The limitation for labour complaints varies by state (typically 3 years).',
    emergency: false,
  },
  {
    id: 'emp-002',
    keywords: ['sexual harassment', 'sexually harassing', 'sexually harassed', 'posh', 'workplace harassment', 'office harassment', 'me too', 'ICC', 'internal complaint', 'harassing me at'],
    category: 'employment',
    urgency: 'URGENT',
    title: 'Workplace Sexual Harassment',
    laws: [
      { section: 'POSH Act, 2013', description: 'Prevention, Prohibition and Redressal of Sexual Harassment at Workplace.' },
      { section: 'Section 4 POSH Act', description: 'Employer must constitute an Internal Complaints Committee (ICC).' },
      { section: 'Section 9 POSH Act', description: 'File complaint with ICC within 3 months of the incident.' },
      { section: 'Section 354A IPC', description: 'Sexual harassment as a criminal offence – up to 3 years.' },
    ],
    recommendation: 'File a written complaint with the Internal Complaints Committee (ICC) of your organization within 3 months. If no ICC exists, file with the Local Complaints Committee (District Officer, Women & Child Development). Document all incidents with dates, places, witnesses. Request interim relief (transfer, leave). You may also file an FIR under IPC Section 354A simultaneously. Your identity is protected and retaliation is prohibited.',
    emergency: true,
  },
  {
    id: 'emp-003',
    keywords: ['salary not paid', 'wages not paid', 'pf not paid', 'provident fund', 'gratuity', 'bonus not paid', 'salary', 'wages', 'not paid my salary', 'not paid salary', 'pf', 'unpaid salary'],
    category: 'employment',
    urgency: 'MEDIUM',
    title: 'Unpaid Wages / Salary / PF',
    laws: [
      { section: 'Payment of Wages Act, 1936', description: 'Timely payment of wages; maximum delay allowed is 7 days.' },
      { section: 'Payment of Gratuity Act, 1972', description: 'Gratuity due after 5 years of continuous service.' },
      { section: 'PF Act (EPF & MP Act, 1952)', description: 'PF contributions are mandatory and must be deposited within 15 days.' },
      { section: 'Payment of Bonus Act, 1965', description: 'Annual bonus entitlement for eligible employees.' },
    ],
    recommendation: 'Send a written demand to HR/management citing specific amounts owed. File a complaint with the Labour Commissioner (under Payment of Wages Act) or approach the Industrial Court. For PF issues, file a complaint with the EPFO regional office or EPF Grievance portal (epfigms.gov.in). For gratuity, send a formal application; employer must pay within 30 days.',
    emergency: false,
  },

  // ─── CYBER LAW ───────────────────────────────────────────────────────
  {
    id: 'cyber-001',
    keywords: ['hacked', 'cyber crime', 'online fraud', 'phishing', 'data breach', 'account hacked', 'cyber attack', 'otp fraud', 'hacked my bank', 'took my otp', 'otp', 'bank fraud', 'bank account fraud', 'hack'],
    category: 'cyber',
    urgency: 'HIGH',
    title: 'Cybercrime / Online Fraud',
    laws: [
      { section: 'IT Act, 2000 Section 66', description: 'Computer-related offences – up to 3 years imprisonment.' },
      { section: 'IT Act Section 66C', description: 'Identity theft using computer resource – up to 3 years + fine.' },
      { section: 'IT Act Section 66D', description: 'Cheating by personation using computer – up to 3 years + fine.' },
      { section: 'IT Act Section 43A', description: 'Compensation for failure to protect sensitive personal data.' },
    ],
    recommendation: 'Immediately freeze/block affected bank accounts by calling your bank\'s helpline. File a complaint on the National Cyber Crime portal: cybercrime.gov.in or call 1930 (Cyber Crime helpline). Also file an FIR at the nearest police station under IT Act. Preserve all screenshots, emails, transaction IDs, and chat logs. For financial fraud, the sooner you report, the higher the chance of fund recovery.',
    emergency: true,
  },
  {
    id: 'cyber-002',
    keywords: ['defamation', 'defamatory', 'online defamation', 'social media abuse', 'trolling', 'reputation damage', 'false news about me', 'morphed image', 'damage my reputation', 'damaging my reputation'],
    category: 'cyber',
    urgency: 'MEDIUM',
    title: 'Online Defamation / Reputation Damage',
    laws: [
      { section: 'Section 499–500 IPC', description: 'Defamation – criminal liability up to 2 years.' },
      { section: 'IT Act Section 66A', description: 'Note: SC struck down 66A in Shreya Singhal case, but other provisions apply.' },
      { section: 'IT Act Section 67', description: 'Publishing obscene material online – up to 5 years.' },
      { section: 'Section 505 IPC', description: 'Statements conducing to public mischief.' },
    ],
    recommendation: 'Take screenshots with timestamps of the defamatory content. Report and request takedown from the platform (Facebook, Twitter etc. have legal request portals). File a complaint at cybercrime.gov.in. Send a legal cease-and-desist notice through a lawyer. For damages, file a civil defamation suit. For morphed/intimate images, specific relief is available under IT Act Section 67A.',
    emergency: false,
  },

  // ─── HUMAN RIGHTS / HARASSMENT ──────────────────────────────────────
  {
    id: 'hr-001',
    keywords: ['caste discrimination', 'untouchability', 'atrocity', 'scheduled caste', 'sc st', 'dalit', 'caste abuse'],
    category: 'civil_rights',
    urgency: 'URGENT',
    title: 'Caste Discrimination / Atrocity',
    laws: [
      { section: 'SC & ST (Prevention of Atrocities) Act, 1989', description: 'Specific offences against SC/ST with enhanced penalties.' },
      { section: 'Article 17, Constitution', description: 'Abolition of untouchability – a fundamental right.' },
      { section: 'Protection of Civil Rights Act, 1955', description: 'Punishes practice of untouchability.' },
      { section: 'Section 3 Atrocities Act', description: 'Listed atrocities carry 6 months to life imprisonment.' },
    ],
    recommendation: 'File an FIR immediately at the nearest police station – the police MUST register it under the Atrocities Act (cannot refuse). Demand that the FIR is registered under specific sections of the SC/ST Act. If police refuse, approach the Superintendent of Police, Collector, or High Court. Legal aid is available free of cost from the District Legal Services Authority (DLSA). The government provides compensation to victims.',
    emergency: true,
  },

  // ─── ACCIDENT / INSURANCE ───────────────────────────────────────────
  {
    id: 'acc-001',
    keywords: ['accident', 'motor accident', 'car accident', 'road accident', 'MACT', 'vehicle accident', 'insurance claim', 'hit and run'],
    category: 'civil',
    urgency: 'HIGH',
    title: 'Motor Vehicle Accident',
    laws: [
      { section: 'Motor Vehicles Act, 1988', description: 'Comprehensive law on motor vehicle accidents and compensation.' },
      { section: 'Section 166 MVA', description: 'Claim petition before Motor Accident Claims Tribunal (MACT).' },
      { section: 'Section 163A MVA', description: 'Structured formula compensation (no-fault liability).' },
      { section: 'Section 147 MVA', description: 'Third-party insurance is mandatory for all vehicles.' },
    ],
    recommendation: 'Seek medical attention immediately. Call police (100) to register an FIR/MLC for accidents with injuries. Collect vehicle details, registration, insurance details of the other party and witness contact information. Photograph the scene. File a claim before the Motor Accident Claims Tribunal (MACT) at your district court. The insurer must respond within 30 days. For hit-and-run: claim from Solatium Fund under MVA.',
    emergency: true,
  },

  // ─── REAL ESTATE / RERA ─────────────────────────────────────────────
  {
    id: 'rera-001',
    keywords: ['builder', 'flat', 'apartment', 'real estate', 'RERA', 'delayed possession', 'builder cheating', 'housing project', 'incomplete construction'],
    category: 'civil',
    urgency: 'MEDIUM',
    title: 'Builder / Real Estate Dispute',
    laws: [
      { section: 'RERA Act, 2016', description: 'Real Estate (Regulation and Development) Act – protects homebuyers.' },
      { section: 'Section 18 RERA', description: 'Refund + interest if builder fails to deliver on time.' },
      { section: 'Section 31 RERA', description: 'File complaint with State RERA Authority.' },
      { section: 'Consumer Protection Act, 2019', description: 'Alternative forum for consumer complaints against builders.' },
    ],
    recommendation: 'File a complaint with your State RERA Authority online. RERA mandates that all residential projects must be registered, and builders must adhere to timelines. You are entitled to full refund + interest (SBI PLR + 2%) for delays. Keep your sale agreement, payment receipts, and all correspondence with the builder. You can simultaneously approach the Consumer Forum for deficiency of service.',
    emergency: false,
  },

  // ─── INHERITANCE / SUCCESSION ────────────────────────────────────────
  {
    id: 'succ-001',
    keywords: ['will', 'inheritance', 'succession', 'property after death', 'heir', 'estate', 'probate', 'intestate'],
    category: 'civil',
    urgency: 'LOW',
    title: 'Inheritance / Will / Succession',
    laws: [
      { section: 'Hindu Succession Act, 1956', description: 'Intestate succession for Hindus, Buddhists, Jains, Sikhs.' },
      { section: 'Indian Succession Act, 1925', description: 'Succession for Christians, Parsis, and all communities for testamentary succession.' },
      { section: 'Muslim Personal Law (Shariat)', description: 'Inheritance governed by Islamic law for Muslims.' },
      { section: 'Section 213 ISA', description: 'Probate required for Will in some states (Bombay, Madras, Calcutta High Court areas).' },
    ],
    recommendation: 'If there is a Will, apply for Probate in the High Court to establish its legal validity (required in Presidencies). For intestate succession, obtain a Succession Certificate from the Civil Court. Gather: death certificate, property documents, relationship proof. Apply for mutation of property records at the local municipal office after getting legal heirship certificate. A family settlement deed can be used to avoid court if all heirs agree.',
    emergency: false,
  },
];

/**
 * Scores a situation against a knowledge entry based on keyword matches.
 * @param {string} situation - User's described situation
 * @param {object} entry - Knowledge base entry
 * @returns {number} - Score (number of keyword matches)
 */
function scoreEntry(situation, entry) {
  const lowerSit = situation.toLowerCase();
  let score = 0;
  for (const kw of entry.keywords) {
    if (lowerSit.includes(kw)) score++;
  }
  return score;
}

/**
 * Main function: find the best-matching legal entry for a given situation.
 * Returns the top 2 matches (in case of multi-faceted situations).
 * @param {string} situation - User's situation description
 * @returns {{ primary: object, secondary: object|null, allMatches: Array }}
 */
function getSuggestions(situation) {
  const scored = legalKnowledge
    .map((entry) => ({ ...entry, score: scoreEntry(situation, entry) }))
    .filter((e) => e.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    // Fallback general suggestion
    return {
      primary: {
        id: 'general-001',
        category: 'general',
        urgency: 'MEDIUM',
        title: 'General Legal Consultation Required',
        laws: [
          { section: 'Legal Services Authorities Act, 1987', description: 'Free legal aid available to eligible persons through DLSA.' },
          { section: 'Article 39A, Constitution', description: 'Directs state to ensure legal justice is not denied due to economic reasons.' },
        ],
        recommendation: 'Your situation requires analysis by a qualified lawyer. We recommend consulting a licensed advocate. You may also contact the District Legal Services Authority (DLSA) for free legal aid if you are eligible (BPL, women, SC/ST, disabled, or income below ₹3 lakhs). The National Legal Services Authority (NALSA) helpline is 15100.',
        emergency: false,
        score: 0,
      },
      secondary: null,
      allMatches: [],
    };
  }

  return {
    primary: scored[0],
    secondary: scored.length > 1 && scored[1].score > 0 ? scored[1] : null,
    allMatches: scored.slice(0, 3),
  };
}

module.exports = { legalKnowledge, getSuggestions };
