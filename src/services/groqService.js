// Groq API Service for Detective-L (L-System Interrogation & Case Analysis)
// Powered by Llama-3.3-70B-Versatile on Groq Cloud

import { INITIAL_CASES } from '../data/cases';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

// Retrieve API key from environment variable or localStorage
export const getGroqApiKey = () => {
  const envKey = import.meta.env.VITE_GROQ_API_KEY;
  const localKey = localStorage.getItem('detective_l_groq_key');
  return localKey || envKey || '';
};

export const setGroqApiKey = (key) => {
  localStorage.setItem('detective_l_groq_key', key);
};

/**
 * Interrogates a specific suspect using Groq LLM
 */
export async function interrogateSuspect({
  caseData,
  suspect,
  chatHistory,
  userQuestion,
  confrontedClue = null,
  currentStress = 30
}) {
  const apiKey = getGroqApiKey();

  if (!apiKey) {
    throw new Error('Groq API Key is not configured. Please add VITE_GROQ_API_KEY in your .env file or input it in settings to enable live AI interrogation.');
  }

  // Create detailed system prompt for the suspect's persona
  const systemPrompt = `You are roleplaying as "${suspect.name}", a suspect in a high-stakes murder mystery case investigated by Detective-L (Rakesh Soni).

CASE SUMMARY:
- Case Title: "${caseData.title}"
- Victim: ${caseData.victim} (${caseData.victimRole})
- Crime Details: ${caseData.crimeDetails}
- Time of Death: ${caseData.timeOfDeath}
- Crime Scene: ${caseData.location}

YOUR CHARACTER IDENTITY & ROLE:
- Role/Relation: ${suspect.role}
- Personality & Demeanor: ${suspect.personality}
- Voice & Tone: ${suspect.voiceTone}
- Public Alibi: "${suspect.publicAlibi}"
- Secret / Hidden Motive: "${suspect.hiddenSecret}"
- Is the actual Killer? ${suspect.isKiller ? "YES, YOU ARE THE KILLER. You murdered the victim. You must do everything you can to deflect suspicion subtly without making obvious logical blunders, but if trapped with undeniable evidence, show cracking under pressure." : "NO, you are innocent of murder, but you may have hidden personal secrets/scandals you are afraid to reveal."}
- Vulnerabilities / What makes you crack: ${suspect.vulnerabilities || 'Specific evidence contradictions, aggressive timeline scrutiny'}

ROLEPLAY RULES:
1. Stay in character 100%. Speak in the first person ("I", "me").
2. Respond naturally to the detective's interrogation. Keep responses engaging, concise (2-4 sentences max per reply), dramatic, and tense.
3. If the detective confronts you with evidence (${confrontedClue ? `Confronted with: "${confrontedClue.title} - ${confrontedClue.description}"` : 'None'}), evaluate if it contradicts your story. If it touches your secret or proves you lied, your nervousness and stress must spike, and you may stutter, give defensive rationalizations, or reveal partial truths.
4. Output your response as a valid JSON object with the following structure:
{
  "dialogue": "Your in-character spoken reply here",
  "stressDelta": integer between -15 and +30 (how much this question increased or decreased your stress),
  "heartRateBpm": integer estimated between 65 and 160 (based on your stress and guilt),
  "emotionalState": "one of: [Defensive, Nervous, Calm, Arrogant, Terrified, Evasive, Smug, Distraught]",
  "suspicionRating": integer 1-100 (how guilty you appear in this moment),
  "telltaleSign": "A physical tell (e.g. 'Touches neck collar', 'Eyes dart to the side', 'Voice falters', 'Smiles coldly')"
}
IMPORTANT: Return ONLY the JSON object, with no surrounding markdown or explanation.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...chatHistory.map(msg => ({
      role: msg.sender === 'detective' ? 'user' : 'assistant',
      content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)
    })),
    {
      role: 'user',
      content: confrontedClue 
        ? `[DETECTIVE CONFRONTS YOU WITH EVIDENCE: ${confrontedClue.title} - "${confrontedClue.description}"]\n\nQuestion: "${userQuestion}"` 
        : userQuestion
    }
  ];

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `Groq API Error: HTTP ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.choices[0]?.message?.content;
    const parsed = JSON.parse(rawContent);

    return {
      dialogue: parsed.dialogue || "I have nothing further to say to that without my legal counsel.",
      stressDelta: parsed.stressDelta || 5,
      heartRateBpm: parsed.heartRateBpm || (75 + Math.floor(Math.random() * 20)),
      emotionalState: parsed.emotionalState || "Defensive",
      suspicionRating: parsed.suspicionRating || 50,
      telltaleSign: parsed.telltaleSign || "Glances away nervously"
    };
  } catch (error) {
    console.error('Groq Interrogation error:', error);
    throw error;
  }
}

/**
 * Ask "L" - The Master Detective AI Copilot for advice & deduction analysis
 */
export async function consultDetectiveL({ caseData, clues, connections, currentQuestion }) {
  const apiKey = getGroqApiKey();
  
  if (!apiKey) {
    throw new Error('Groq API Key missing. Please provide a valid Groq API key.');
  }

  const prompt = `You are L, the world's greatest consulting detective, assisting Detective Rakesh Soni on the case: "${caseData.title}".
VICTIM: ${caseData.victim}
LOCATION: ${caseData.location}
CRIME SUMMARY: ${caseData.crimeDetails}

CURRENT KNOWN CLUES:
${clues.map(c => `- [${c.category.toUpperCase()}] ${c.title}: ${c.description}`).join('\n')}

DETECTIVE'S QUESTION / THOUGHT:
"${currentQuestion}"

Provide sharp, razor-focused deductive reasoning, spot potential timeline contradictions among the 5 suspects, and suggest the exact next high-leverage investigative move or interrogation question.
Keep your response concise, brilliant, and styled in L's calm, analytical, and eccentric tone. (Under 180 words).`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: 'system', content: 'You are L, the world-renowned analytical detective with unmatched deductive prowess.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 350,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `Groq API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "No deductive output received from neural model.";
  } catch (error) {
    console.error('Groq Copilot error:', error);
    throw error;
  }
}

/**
 * Evaluates an Accusation and Generates Legal Verdict
 */
export async function evaluateAccusation({ caseData, accusedSuspect, murderWeapon, motive, finalStatement }) {
  const apiKey = getGroqApiKey();

  const isCorrectKiller = accusedSuspect.isKiller;
  const isCorrectWeapon = murderWeapon.toLowerCase().includes(caseData.murderWeapon.toLowerCase()) || 
                          caseData.murderWeapon.toLowerCase().includes(murderWeapon.toLowerCase());

  if (!apiKey) {
    return {
      isGuilty: isCorrectKiller && isCorrectWeapon,
      grade: isCorrectKiller && isCorrectWeapon ? "S - Master Detective" : "F - Case Dismissed",
      courtroomDrama: isCorrectKiller && isCorrectWeapon
        ? `The defense collapses under the weight of the evidence. ${accusedSuspect.name} breaks down in the courtroom and makes a full confession to the murder of ${caseData.victim}.`
        : `The court dismisses the charges due to insufficient or misdirected evidence. ${accusedSuspect.name} walks free.`,
      breakdown: {
        suspectAccused: accusedSuspect.name,
        actualKiller: caseData.suspects.find(s => s.isKiller)?.name,
        killerIdentified: isCorrectKiller,
        weaponCorrect: isCorrectWeapon,
        actualWeapon: caseData.murderWeapon,
        actualMotive: caseData.actualMotive
      }
    };
  }

  const prompt = `Evaluate Detective Rakesh Soni's final court indictment for case: "${caseData.title}".
- ACCUSED: ${accusedSuspect.name} (Actual Killer: ${isCorrectKiller ? 'YES' : 'NO, actual killer is ' + caseData.suspects.find(s => s.isKiller)?.name})
- WEAPON PRESENTED: "${murderWeapon}" (Actual Murder Weapon: "${caseData.murderWeapon}")
- MOTIVE ARGUED: "${motive}" (Actual Motive: "${caseData.actualMotive}")
- FINAL PROSECUTION STATEMENT: "${finalStatement}"

Output valid JSON:
{
  "isGuilty": boolean (true if correct suspect and weapon, false otherwise),
  "grade": "one of: [S - Legendary Master Detective, A - Solid Conviction, B - Flawed Case, F - Case Dismissed / Wrongful Accusation]",
  "courtroomDrama": "A dramatic 3-5 sentence cinematic courtroom climax describing the judge's reaction, the accused's reaction (confession if caught or smirk if acquitted), and the final sentence."
}`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
        max_tokens: 500,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) throw new Error('Groq Accusation eval failed');

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0]?.message?.content);

    return {
      isGuilty: parsed.isGuilty ?? (isCorrectKiller && isCorrectWeapon),
      grade: parsed.grade || (isCorrectKiller && isCorrectWeapon ? "A" : "F"),
      courtroomDrama: parsed.courtroomDrama,
      breakdown: {
        suspectAccused: accusedSuspect.name,
        actualKiller: caseData.suspects.find(s => s.isKiller)?.name,
        killerIdentified: isCorrectKiller,
        weaponCorrect: isCorrectWeapon,
        actualWeapon: caseData.murderWeapon,
        actualMotive: caseData.actualMotive
      }
    };
  } catch (e) {
    console.error(e);
    return {
      isGuilty: isCorrectKiller && isCorrectWeapon,
      grade: isCorrectKiller && isCorrectWeapon ? "A - Conviction" : "F - Acquitted",
      courtroomDrama: isCorrectKiller && isCorrectWeapon 
        ? `${accusedSuspect.name} breaks down and confesses in open court.` 
        : `The prosecution failed to prove guilt beyond reasonable doubt.`,
      breakdown: {
        suspectAccused: accusedSuspect.name,
        actualKiller: caseData.suspects.find(s => s.isKiller)?.name,
        killerIdentified: isCorrectKiller,
        weaponCorrect: isCorrectWeapon,
        actualWeapon: caseData.murderWeapon,
        actualMotive: caseData.actualMotive
      }
    };
  }
}

function buildProceduralCaseFromPrompt(rawText) {
  const cleanTitle = rawText.split('\n')[0].replace(/case|investigation|file|real|crime/gi, '').trim() || 'Cold Case Mystery';
  const displayTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
  const caseId = `case-${Date.now()}`;

  return {
    id: caseId,
    title: `The ${displayTitle} Mystery`,
    subtitle: `Real-World Cold Case Forensic & Suspect Investigation`,
    difficulty: `Active Investigation (5 Suspects)`,
    estimatedTime: `25-35 mins`,
    status: `ACTIVE INVESTIGATION`,
    victim: `Primary Subject / Victim`,
    victimRole: `Central Figure in ${displayTitle}`,
    timeOfDeath: `Late Night (01:00 - 04:00 IST)`,
    location: `Crime Scene & Key Ground Locations`,
    overview: `Investigation file generated for ${displayTitle}. Based on submitted dossier notes: "${rawText.slice(0, 300)}...". Central forensic teams have isolated 5 persons of interest with conflicting timelines and hidden motives.`,
    crimeDetails: `Physical trauma and foul play verified by initial on-scene forensic sweep. Forensic recovery indicates intentional tampering with crime scene telemetry.`,
    culpritId: `suspect-prime-1`,
    murderWeapon: `Direct Physical Weapon / Forensic Mechanism`,
    actualMotive: `Personal dispute and intentional cover-up of incriminating evidence.`,
    keyContradiction: `Prime suspect claimed complete absence from the area, but digital telemetry and physical traces place them directly at the scene during the critical window.`,
    suspects: [
      {
        id: `suspect-prime-1`,
        name: `Vikramaditya 'Vikram' Roy`,
        role: `Primary Person of Interest`,
        age: 38,
        avatar: `https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80`,
        personality: `Defiant, calculative, quick to shift blame to subordinate staff.`,
        voiceTone: `Sharp, abrupt, nervous when pressed on specific timestamps.`,
        publicAlibi: `I was at home sleeping and only learned of the incident hours later.`,
        hiddenSecret: `Was physically present at the premises and attempted to erase digital entry logs.`,
        isKiller: true,
        vulnerabilities: `Digital CCTV entry timestamp and discarded physical trace evidence.`
      },
      {
        id: `suspect-duty-officer-2`,
        name: `Inspector Rajiv Sen`,
        role: `On-Duty Watch Supervisor`,
        age: 44,
        avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80`,
        personality: `Bureaucratic, exhausted, defensive about institutional lapses.`,
        voiceTone: `Authoritative, defensive.`,
        publicAlibi: `I was stationed at the control desk continuously during the shift.`,
        hiddenSecret: `Left the duty desk unattended for 45 minutes during the critical murder window.`,
        isKiller: false,
        vulnerabilities: `Duty transfer register logbook gaps.`
      },
      {
        id: `suspect-associate-3`,
        name: `Dr. Ananya Mukherjee`,
        role: `Senior Colleague & Department Associate`,
        age: 34,
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`,
        personality: `Analytical, guarded, cautious about legal exposure.`,
        voiceTone: `Precise, measured, polite.`,
        publicAlibi: `I was working on administrative files in the adjacent wing.`,
        hiddenSecret: `Discovered a key discrepancy in departmental logs but delayed reporting it.`,
        isKiller: false,
        vulnerabilities: `Internal email timestamps and phone message records.`
      },
      {
        id: `suspect-custodian-4`,
        name: `Rameshwar Mandal`,
        role: `Night Facility & Keys Custodian`,
        age: 49,
        avatar: `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80`,
        personality: `Nervous, easily intimidated, observant of late-night movements.`,
        voiceTone: `Submissive, fearful.`,
        publicAlibi: `I was in the basement maintenance room.`,
        hiddenSecret: `Saw the prime suspect enter the restricted corridor after hours.`,
        isKiller: false,
        vulnerabilities: `Facility key checkout logbook.`
      },
      {
        id: `suspect-witness-5`,
        name: `Kunal Ghosh`,
        role: `Independent Eyewitness & Delivery Driver`,
        age: 31,
        avatar: `https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80`,
        personality: `Street-smart, outspoken, cooperative with investigators.`,
        voiceTone: `Fast-talking, casual.`,
        publicAlibi: `I made a delivery at 03:15 AM and left the campus.`,
        hiddenSecret: `Noticed a suspicious vehicle parked with headlights turned off.`,
        isKiller: false,
        vulnerabilities: `Delivery time-stamped invoice and dashcam record.`
      }
    ],
    clues: [
      {
        id: `clue-custom-weapon-${Date.now()}`,
        title: `Recovered Physical Murder Evidence`,
        category: `physical`,
        description: `Physical trace evidence recovered from the primary scene displaying foreign biological residue matching the prime suspect.`,
        significance: `Direct forensic link connecting suspect-prime-1 to the exact crime spot.`,
        nodeType: `evidence`,
        discovered: true,
        x: 420,
        y: 170
      },
      {
        id: `clue-custom-cctv-${Date.now()}`,
        title: `Corridor CCTV Timestamp Log`,
        category: `digital`,
        description: `Security camera footage capturing an unauthorized individual entering the restricted corridor at 03:42 AM.`,
        significance: `Refutes the prime suspect's public alibi of being at home.`,
        nodeType: `evidence`,
        discovered: true,
        x: 650,
        y: 240
      },
      {
        id: `clue-custom-autopsy-${Date.now()}`,
        title: `Central Forensic Examination Report`,
        category: `forensic`,
        description: `Autopsy findings confirming time of death and defensive trauma matching physical struggle.`,
        significance: `Establishes critical timeline window for interrogation cross-examination.`,
        nodeType: `evidence`,
        discovered: true,
        x: 220,
        y: 290
      },
      {
        id: `clue-custom-phone-${Date.now()}`,
        title: `Encrypted Phone & Messaging Log`,
        category: `digital`,
        description: `Call detail records showing rapid midnight communications right before the incident.`,
        significance: `Proves coordination and urgency during the timeline.`,
        nodeType: `evidence`,
        discovered: true,
        x: 450,
        y: 430
      }
    ],
    defaultConnections: [
      { id: `conn-c-1`, from: `suspect-prime-1`, to: `clue-custom-weapon-${Date.now()}`, label: `Physical Trace Match` },
      { id: `conn-c-2`, from: `suspect-prime-1`, to: `clue-custom-cctv-${Date.now()}`, label: `03:42 AM Ingress` }
    ],
    osintData: {
      socialLeaks: [],
      geoTraces: [],
      forensics: []
    },
    crimeScene: {
      backgroundImage: `https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80`,
      description: `Crime scene grounds for ${displayTitle}.`,
      hotspots: []
    }
  };
}

/**
 * Generate a complete playable Case from a custom User Prompt, Real FIR Text, or curated case matches
 */
export async function generateCaseWithAI(userCaseIdea = '') {
  const query = userCaseIdea.toLowerCase().trim();

  // 1. Instant match with rich curated real cases
  if (query.includes('rg kar') || query.includes('kar hospital') || query.includes('kolkata doctor') || query.includes('seminar hall') || query.includes('seminar room') || query.includes('sanjay roy')) {
    const matched = INITIAL_CASES.find(c => c.id === 'case-rg-kar-2024');
    if (matched) return { ...matched, id: `case-rg-kar-${Date.now()}` };
  }

  if (query.includes('burari') || query.includes('sant nagar') || query.includes('11 death') || query.includes('chundawat')) {
    const matched = INITIAL_CASES.find(c => c.id === 'case-burari-2018');
    if (matched) return { ...matched, id: `case-burari-${Date.now()}` };
  }

  if (query.includes('stoneman') || query.includes('pavement')) {
    const matched = INITIAL_CASES.find(c => c.id === 'case-stoneman-kolkata');
    if (matched) return { ...matched, id: `case-stoneman-${Date.now()}` };
  }

  if (query.includes('noida') || query.includes('aarushi') || query.includes('talwar') || query.includes('hemraj')) {
    const matched = INITIAL_CASES.find(c => c.id === 'case-noida-2008');
    if (matched) return { ...matched, id: `case-noida-${Date.now()}` };
  }

  if (query.includes('zodiac') || query.includes('vallejo') || query.includes('lake berryessa')) {
    const matched = INITIAL_CASES.find(c => c.id === 'case-zodiac-1969');
    if (matched) return { ...matched, id: `case-zodiac-${Date.now()}` };
  }

  const apiKey = getGroqApiKey();
  if (apiKey) {
    try {
      const prompt = `You are the lead case architect for the premier detective investigation suite "Detective-L".
Generate a complex, realistic, high-stakes murder mystery case based on this user prompt / FIR / real news text:
"${userCaseIdea}"

REQUIREMENTS:
1. Create exactly 5 distinct suspects with rich backgrounds, realistic alibis, hidden motives/secrets, and only ONE true killer (isKiller: true).
2. Create 7-9 specific clues across categories: "physical", "forensic", "digital", "testimonial".
3. Clues must include at least 1 weapon, 1 forensic autopsy/toxicology report, 1 digital CCTV/phone record, and multiple alibi contradictions.
4. Provide a clear, logical murder timeline and exact killer identity that can be solved by connecting the clues.

Output the entire case in valid JSON with this exact schema:
{
  "id": "custom-case-${Date.now()}",
  "title": "Compelling Noir Case Title",
  "subtitle": "Short dramatic tagline",
  "difficulty": "Hard (5 Suspects)",
  "estimatedTime": "25-35 mins",
  "status": "UNSOLVED",
  "victim": "Full Name of Victim",
  "victimRole": "Their Occupation / Social Role",
  "timeOfDeath": "Exact date and time window",
  "location": "Detailed crime scene address / room",
  "overview": "2-3 paragraphs of gripping case background and circumstance.",
  "crimeDetails": "Specific mechanism of death, weapon marks, forensic details.",
  "murderWeapon": "Exact weapon used",
  "actualMotive": "The true reason why the killer committed the crime",
  "keyContradiction": "The crucial logical flaw in the killer's alibi that proves their guilt",
  "suspects": [
    {
      "id": "suspect-1",
      "name": "Full Name",
      "role": "Relationship to victim",
      "age": 35,
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      "personality": "Psychological traits",
      "voiceTone": "How they speak under interrogation",
      "publicAlibi": "Where they claim they were",
      "hiddenSecret": "Secret/scandal they are hiding",
      "isKiller": true,
      "vulnerabilities": "Evidence that makes them crack"
    }
  ],
  "clues": [
    {
      "id": "clue-1",
      "title": "Clue Title",
      "category": "physical",
      "description": "Thorough description of the clue and where it was found",
      "significance": "Why this clue matters to the investigation",
      "nodeType": "evidence",
      "discovered": true,
      "x": 300,
      "y": 200
    }
  ],
  "defaultConnections": [
    {
      "from": "clue-1",
      "to": "suspect-1",
      "label": "Direct Link",
      "confidence": 75
    }
  ]
}
Return ONLY valid JSON.`;

      const data = await callGroqWithFallback({
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2800,
        response_format: { type: "json_object" }
      }, apiKey);

      const parsed = JSON.parse(data.choices[0].message.content);
      return parsed;
    } catch (err) {
      console.warn('Groq Case Generation failed, falling back to procedural synthesizer:', err);
    }
  }

  // Fallback Procedural Case Synthesizer (Instant generation with zero blockers)
  return buildProceduralCaseFromPrompt(userCaseIdea);
}

export const generateProceduralCase = generateCaseWithAI;


const FALLBACK_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'llama-3.1-70b-versatile',
  'llama3-70b-8192',
  'mixtral-8x7b-32768'
];

async function callGroqWithFallback(payload, apiKey) {
  let lastError = null;
  for (const model of FALLBACK_MODELS) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          ...payload,
          model
        }),
      });

      if (response.ok) {
        return await response.json();
      }

      const err = await response.json().catch(() => ({}));
      lastError = new Error(err.error?.message || `Groq API Error: ${response.status}`);
      
      if (err.error?.code === 'model_not_found' || err.error?.message?.includes('model')) {
        continue;
      }
      throw lastError;
    } catch (e) {
      lastError = e;
      if (model === FALLBACK_MODELS[FALLBACK_MODELS.length - 1]) {
        throw lastError;
      }
    }
  }
  throw lastError;
}

function generateForensicDeduction({ activeCase, discoveredClues = [], searchResults = [], query = '' }) {
  const killer = activeCase?.suspects?.find(s => s.isKiller) || activeCase?.suspects?.[0];
  const cluesList = discoveredClues.length > 0
    ? discoveredClues.map(c => `• **${c.title}** (${c.category.toUpperCase()}): ${c.description}`).join('\n')
    : '• Initial crime scene telemetry recorded.';

  const searchSection = searchResults.length > 0
    ? `\n\n**🌐 Live Multi-Engine Search Summary (${searchResults.length} genuine sources consulted):**\n` +
      searchResults.slice(0, 4).map(s => `• **[${s.source}${s.subreddit ? ` · ${s.subreddit}` : ''}]** [${s.title}](${s.url})\n  ${s.snippet}`).join('\n\n')
    : '';

  return `### 🕵️ Detective-L Forensic Intelligence Synthesis

**Case File:** "${activeCase?.title || 'Active Investigation'}"

**1. 📋 Clue Memory & Evidence Analysis:**
${cluesList}

**2. ⚠️ Key Suspect Contradictions & Timeline Gaps:**
• **${killer?.name || 'Primary Suspect'}** (${killer?.role}): Public Alibi states "*${killer?.publicAlibi || 'at home'}*", but forensic evidence indicates timeline impossibilities during the critical murder window (${activeCase?.timeOfDeath}).
• **Physical Evidence Match:** The murder weapon (**${activeCase?.murderWeapon || 'heavy bludgeon'}**) matches trauma patterns at ${activeCase?.location}.${searchSection}

**3. 🎯 High-Leverage Next Move:**
1. Click **"✨ Auto-Connect Dots"** to establish the physical evidence links on your Pinboard.
2. Question **${killer?.name}** in the Interrogation Room and press them directly on their alibi discrepancy.
3. Review the Crime Scene for secondary forensic trace evidence.`;
}

/**
 * Interactive Multi-Turn Chatbot with Detective-L
 * Remembers discovered clues, case suspects, pinboard connections, and synthesizes live search results from Reddit and the Web.
 */
export async function chatWithDetectiveL({
  messages = [],
  activeCase,
  discoveredClues = [],
  currentConnections = [],
  searchResults = []
}) {
  const apiKey = getGroqApiKey();
  const lastUserMsg = messages[messages.length - 1]?.text || messages[messages.length - 1]?.content || '';

  const discoveredCluesText = (discoveredClues.length > 0 
    ? discoveredClues.map(c => `• [${c.category.toUpperCase()}] ${c.title}: "${c.description}" (Significance: ${c.significance})`).join('\n')
    : 'No physical/forensic clues discovered yet.');

  const suspectsText = (activeCase?.suspects || []).map(s => 
    `• ${s.name} (${s.role}): Alibi: "${s.publicAlibi}" | Demeanor: ${s.personality}`
  ).join('\n');

  const connectionsText = (currentConnections.length > 0
    ? currentConnections.map(c => `• ${c.from} ──[${c.label || 'connected'}]──> ${c.to}`).join('\n')
    : 'No manual connections made on the pinboard yet.');

  const searchContextText = (searchResults.length > 0
    ? `\n\nLIVE GENUINE MULTI-ENGINE WEB & REDDIT SEARCH RESULTS:\n${searchResults.map((r, i) => `[Source #${i+1} - ${r.source}${r.subreddit ? ` · ${r.subreddit}` : ''}]: ${r.title}\nURL: ${r.url}\nExcerpt: "${r.snippet}"${r.upvotes ? ` (Upvotes: ${r.upvotes})` : ''}`).join('\n\n')}`
    : '');

  const systemPrompt = `You are "Detective-L", the world's most razor-sharp forensic consulting intelligence and interactive AI investigator.
You are actively partnering with the user on the criminal case: "${activeCase?.title || 'Active Investigation'}".

CASE FILE DOSSIER:
- Victim: ${activeCase?.victim} (${activeCase?.victimRole})
- Crime Location: ${activeCase?.location}
- Time / Circumstances: ${activeCase?.timeOfDeath}
- Crime Summary: ${activeCase?.crimeDetails}

PERSONS OF INTEREST (SUSPECTS):
${suspectsText}

CURRENT DISCOVERED EVIDENCE & CLUES (YOUR ACTIVE MEMORY):
${discoveredCluesText}

ACTIVE PINBOARD CONNECTIONS:
${connectionsText}
${searchContextText}

YOUR INVESTIGATIVE DIRECTIVES:
1. Ground every analysis in the actual discovered clues and suspect statements. Remember what the detective has found so far.
2. If live search results (from Reddit, Wikipedia, or Web) are provided above, synthesize them into crisp, verified forensic bullet points and cite the sources.
3. Formulate deductive hypotheses: connect clues to suspect contradictions, point out timeline impossibilities, and suggest concrete next steps (e.g. who to interrogate next and what question to ask, or what hotspot to search).
4. Tone: Brilliant, calm, razor-sharp, noir-styled, deductive, and highly encouraging. Use structured markdown formatting (bullet points, bold key findings).`;

  if (!apiKey) {
    return generateForensicDeduction({ activeCase, discoveredClues, searchResults, query: lastUserMsg });
  }

  try {
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-8).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text || m.content || ''
      }))
    ];

    const data = await callGroqWithFallback({
      messages: formattedMessages,
      temperature: 0.6,
      max_tokens: 800,
    }, apiKey);

    return data.choices[0]?.message?.content || generateForensicDeduction({ activeCase, discoveredClues, searchResults, query: lastUserMsg });
  } catch (err) {
    console.warn('Groq live call failed, falling back to local forensic synthesizer:', err);
    return generateForensicDeduction({ activeCase, discoveredClues, searchResults, query: lastUserMsg });
  }
}

/**
 * Automatically computes logical connections between discovered clues, suspects, and crime points
 */
export async function computeAutoConnections({ activeCase, discoveredClues = [], currentConnections = [] }) {
  const existingKeys = new Set(currentConnections.map(c => `${c.from}->${c.to}`));
  const newConnections = [];

  const suspects = activeCase?.suspects || [];
  const clues = discoveredClues.length > 0 ? discoveredClues : (activeCase?.clues || []).filter(c => c.discovered);

  clues.forEach(clue => {
    suspects.forEach(suspect => {
      const clueText = (clue.title + ' ' + clue.description + ' ' + clue.significance).toLowerCase();
      const suspectText = (suspect.name + ' ' + suspect.role + ' ' + suspect.publicAlibi + ' ' + suspect.hiddenSecret).toLowerCase();

      const sharesKeyword = suspect.name.split(' ').some(part => part.length > 3 && clueText.includes(part.toLowerCase())) ||
        (clue.category === 'physical' && suspect.isKiller) ||
        (clue.category === 'forensic' && (suspectText.includes('doctor') || suspectText.includes('poison') || suspectText.includes('wound') || suspectText.includes('medicine'))) ||
        (clue.category === 'digital' && (suspectText.includes('call') || suspectText.includes('phone') || suspectText.includes('cctv')));

      const key = `${clue.id}->${suspect.id}`;
      if (sharesKeyword && !existingKeys.has(key)) {
        existingKeys.add(key);
        newConnections.push({
          from: clue.id,
          to: suspect.id,
          label: clue.category === 'physical' ? 'Physical Link' : clue.category === 'forensic' ? 'Forensic Match' : 'Alibi Contradiction',
          confidence: suspect.isKiller ? 90 : 65
        });
      }
    });
  });

  if (activeCase?.defaultConnections) {
    activeCase.defaultConnections.forEach(dc => {
      const key = `${dc.from}->${dc.to}`;
      if (!existingKeys.has(key)) {
        existingKeys.add(key);
        newConnections.push(dc);
      }
    });
  }

  return {
    newConnections,
    totalCreated: newConnections.length,
    explanation: newConnections.length > 0
      ? `Auto-connected ${newConnections.length} forensic evidence links across your pinboard.`
      : `All known clue relationships are already connected on the pinboard.`
  };
}

