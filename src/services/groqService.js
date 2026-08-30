// Groq API Service for Detective-L (L-System Interrogation & Case Analysis)

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'llama-3.3-70b-versatile'; // High speed, incredible reasoning & persona roleplay

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

  if (!apiKey) {
    return simulateSuspectReply(suspect, userQuestion, confrontedClue, currentStress);
  }

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
      return simulateSuspectReply(suspect, userQuestion, confrontedClue, currentStress);
    }

    const data = await response.json();
    const rawContent = data.choices[0]?.message?.content;
    const parsed = JSON.parse(rawContent);

    return {
      dialogue: parsed.dialogue || "I have nothing further to say to that without my lawyer.",
      stressDelta: parsed.stressDelta || 5,
      heartRateBpm: parsed.heartRateBpm || (75 + Math.floor(Math.random() * 20)),
      emotionalState: parsed.emotionalState || "Defensive",
      suspicionRating: parsed.suspicionRating || 50,
      telltaleSign: parsed.telltaleSign || "Glances away nervously"
    };
  } catch (error) {
    console.error('Groq Interrogation error:', error);
    return simulateSuspectReply(suspect, userQuestion, confrontedClue, currentStress);
  }
}

/**
 * Ask "L" - The Master Detective AI Copilot for advice & deduction analysis
 */
export async function consultDetectiveL({ caseData, clues, connections, currentQuestion }) {
  const apiKey = getGroqApiKey();
  
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

  if (!apiKey) {
    return "Analyzing the evidence... The timeline between 22:30 and 23:15 presents a critical anomaly. Cross-reference the security logs with the forensic toxicology report. Someone is fabricating their whereabouts.";
  }

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
          { role: 'system', content: "You are L, the world's master consulting detective created by Rakesh Soni. Be supremely logical, observant, and concise." },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 350
      }),
    });

    if (!response.ok) throw new Error('Groq failed');
    const data = await response.json();
    return data.choices[0]?.message?.content || "No deductive conclusion reached yet.";
  } catch (e) {
    console.error('L Consultation Error:', e);
    return "Based on the evidence board, the killer had physical access to the scene before the alert was triggered. Focus your interrogation on whoever had the keys.";
  }
}

/**
 * Generate a brand new procedural cold case (Indian, International, or Custom Theme) with 5 suspects
 */
export async function generateProceduralCase(customTheme = "Real Indian Cold Case in Mumbai") {
  const apiKey = getGroqApiKey();
  
  const systemPrompt = `You are a master investigative journalist and criminologist specializing in authentic murder mystery cases (including real Indian unsolved cases or international cold cases).
Generate an intricate, high-stakes case with EXACTLY 5 SUSPECTS, rich clues, crime scene hotspots, and OSINT leads.

THEME / USER PROMPT: ${customTheme}

Format your output STRICTLY as a JSON object matching this schema:
{
  "id": "case-generated-${Date.now()}",
  "title": "The Title of the Case",
  "subtitle": "Short punchy subline",
  "difficulty": "Master Sleuth",
  "estimatedTime": "25 mins",
  "status": "UNSOLVED",
  "victim": "Victim Full Name / Victims",
  "victimRole": "Their status/profession",
  "timeOfDeath": "e.g. November 14 - 02:30 IST",
  "location": "Specific location and city",
  "overview": "Rich 3-sentence narrative backdrop",
  "crimeDetails": "Specific forensic cause of death and scene state",
  "culpritId": "suspect-1 (must match one of the 5 suspects below)",
  "murderWeapon": "Specific weapon or mechanism",
  "actualMotive": "The true concealed motive",
  "keyContradiction": "The exact contradiction that breaks the killer's alibi",
  "suspects": [
    {
      "id": "suspect-1",
      "name": "Full Name",
      "role": "Relationship to victim/crime",
      "age": 38,
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      "personality": "Personality traits",
      "voiceTone": "How they talk",
      "publicAlibi": "Their stated alibi",
      "hiddenSecret": "Their secret",
      "isKiller": true,
      "vulnerabilities": "What evidence cracks them"
    },
    {
      "id": "suspect-2",
      "name": "Full Name",
      "role": "Relationship to victim",
      "age": 42,
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      "personality": "Personality traits",
      "voiceTone": "How they talk",
      "publicAlibi": "Their stated alibi",
      "hiddenSecret": "Their secret",
      "isKiller": false,
      "vulnerabilities": "What evidence cracks them"
    },
    {
      "id": "suspect-3",
      "name": "Full Name",
      "role": "Relationship to victim",
      "age": 29,
      "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      "personality": "Personality traits",
      "voiceTone": "How they talk",
      "publicAlibi": "Their stated alibi",
      "hiddenSecret": "Their secret",
      "isKiller": false,
      "vulnerabilities": "What evidence cracks them"
    },
    {
      "id": "suspect-4",
      "name": "Full Name",
      "role": "Relationship to victim",
      "age": 51,
      "avatar": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
      "personality": "Personality traits",
      "voiceTone": "How they talk",
      "publicAlibi": "Their stated alibi",
      "hiddenSecret": "Their secret",
      "isKiller": false,
      "vulnerabilities": "What evidence cracks them"
    },
    {
      "id": "suspect-5",
      "name": "Full Name",
      "role": "Relationship to victim",
      "age": 34,
      "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
      "personality": "Personality traits",
      "voiceTone": "How they talk",
      "publicAlibi": "Their stated alibi",
      "hiddenSecret": "Their secret",
      "isKiller": false,
      "vulnerabilities": "What evidence cracks them"
    }
  ],
  "clues": [
    {
      "id": "clue-1",
      "title": "Clue Name",
      "category": "physical",
      "description": "Detailed clue text",
      "significance": "Why it matters",
      "discovered": true,
      "x": 420,
      "y: 180
    },
    {
      "id": "clue-2",
      "title": "Clue Name 2",
      "category": "forensic",
      "description": "Detailed clue text",
      "significance": "Why it matters",
      "discovered": true,
      "x": 650,
      "y": 280
    },
    {
      "id": "clue-3",
      "title": "Clue Name 3",
      "category": "digital",
      "description": "Detailed clue text",
      "significance": "Why it matters",
      "discovered": false,
      "x": 220,
      "y": 480
    }
  ],
  "defaultConnections": [
    { "id": "conn-gen-1", "from": "suspect-1", "to": "clue-1", "label": "Key Link" }
  ],
  "osintData": {
    "socialLeaks": [
      {
        "id": "osint-g-1",
        "target": "Target Name",
        "platform": "DarkNet / Police FIR",
        "timestamp": "Time",
        "snippet": "Snippet text",
        "threatLevel": "High",
        "notes": "Analyst notes"
      }
    ],
    "geoTraces": [],
    "forensics": []
  },
  "crimeScene": {
    "backgroundImage": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80",
    "description": "Crime scene environment description",
    "hotspots": [
      {
        "id": "hotspot-1",
        "name": "Key Scene Hotspot",
        "x": 50,
        "y": 50,
        "radius": 30,
        "clueId": "clue-1",
        "discoveredText": "What is found here"
      }
    ]
  }
}

Return ONLY the raw JSON object.`;

  if (!apiKey) {
    throw new Error("Groq API Key is required to generate custom AI cases.");
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: [{ role: 'user', content: systemPrompt }],
      temperature: 0.8,
      max_tokens: 2800,
      response_format: { type: "json_object" }
    }),
  });

  if (!response.ok) {
    throw new Error('Groq AI Case Generation failed. Please check your API key.');
  }

  const data = await response.json();
  const parsed = JSON.parse(data.choices[0].message.content);
  return parsed;
}

// Fallback simulator for offline/mock mode
function simulateSuspectReply(suspect, question, clue, currentStress) {
  const isPressured = !!clue || currentStress > 60;
  
  if (isPressured) {
    return {
      dialogue: `Wait... where did you get that evidence?! That's completely taken out of context! I didn't kill anyone, I swear!`,
      stressDelta: 18,
      heartRateBpm: Math.min(150, 95 + Math.floor(Math.random() * 30)),
      emotionalState: "Panicked",
      suspicionRating: suspect.isKiller ? 88 : 55,
      telltaleSign: "Swallows hard, hands visibly shaking"
    };
  }

  return {
    dialogue: `I've already told your officers everything I know. ${suspect.publicAlibi}. You're wasting time interrogating me.`,
    stressDelta: 4,
    heartRateBpm: 78 + Math.floor(Math.random() * 10),
    emotionalState: "Defensive",
    suspicionRating: 35,
    telltaleSign: "Crosses arms and leans back"
  };
}
