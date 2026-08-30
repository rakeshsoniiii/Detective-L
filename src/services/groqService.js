// Groq API Service for Detective-L (L-System Interrogation & Case Analysis)
// Powered by Llama-3.3-70B-Versatile on Groq Cloud

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

/**
 * Generate a complete playable Case from a custom User Prompt or Real FIR Text
 */
export async function generateCaseWithAI(userCaseIdea) {
  const apiKey = getGroqApiKey();
  if (!apiKey) {
    throw new Error('Groq API Key is required to construct a new AI Case File.');
  }

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
  "id": "custom-case-" + random string,
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
      "isKiller": boolean,
      "vulnerabilities": "Evidence that makes them crack"
    }
    // EXACTLY 5 SUSPECTS TOTAL
  ],
  "clues": [
    {
      "id": "clue-1",
      "title": "Clue Title",
      "category": "physical" | "forensic" | "digital" | "testimonial",
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

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2800,
      response_format: { type: "json_object" }
    }),
  });

  if (!response.ok) {
    throw new Error('Groq AI Case Generation failed. Please verify your API key and connection.');
  }

  const data = await response.json();
  const parsed = JSON.parse(data.choices[0].message.content);
  return parsed;
}

export const generateProceduralCase = generateCaseWithAI;
