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

  // Build message sequence
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
    // Fallback simulation when API key is missing
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
      const errData = await response.json().catch(() => ({}));
      console.warn('Groq API returned error:', errData);
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
    return "Analyzing the evidence... The timeline between 22:30 and 23:15 presents a critical 45-minute anomaly. Cross-reference the security logs with the physician's toxicology report. Someone is fabricating their whereabouts.";
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
    return "Based on the evidence board, the killer had physical access to the victim's study before the alarm was triggered. Focus your interrogation on whoever had the digital keycard.";
  }
}

/**
 * Generate a brand new procedural cold case with 5 suspects using Groq
 */
export async function generateProceduralCase(customTheme = "Cyberpunk Neo-Noir Murder") {
  const apiKey = getGroqApiKey();
  
  const systemPrompt = `You are a master mystery writer and detective scenario architect.
Generate an intricate, captivating, logic-tight murder mystery case with EXACTLY 5 SUSPECTS, rich clues, crime scene hotspots, and OSINT leads.

THEME: ${customTheme}

Format your output STRICTLY as a JSON object matching this schema:
{
  "id": "case-generated-${Date.now()}",
  "title": "The Title of the Case",
  "subtitle": "Short punchy subline",
  "difficulty": "Hard",
  "estimatedTime": "25 mins",
  "victim": "Victim Full Name",
  "victimRole": "Their status/profession",
  "timeOfDeath": "e.g. August 28, 2026 - 23:14 EST",
  "location": "Specific lavish or secretive location",
  "overview": "Rich 3-sentence narrative backdrop",
  "crimeDetails": "Specific forensic cause of death and scene state",
  "culpritId": "suspect-X (must match one of the 5 suspects)",
  "murderWeapon": "Specific weapon or toxin",
  "actualMotive": "The true concealed motive",
  "keyContradiction": "The exact contradiction that breaks the killer's alibi",
  "suspects": [
    {
      "id": "suspect-1",
      "name": "Full Name",
      "role": "Relationship to victim",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      "personality": "Personality traits",
      "voiceTone": "How they talk",
      "publicAlibi": "Their stated alibi",
      "hiddenSecret": "Their secret",
      "isKiller": true or false (EXACTLY ONE suspect must have true),
      "vulnerabilities": "What evidence cracks them"
    }
    // EXACTLY 5 SUSPECTS in total
  ],
  "clues": [
    {
      "id": "clue-1",
      "title": "Clue Name",
      "category": "physical | digital | forensic | testimonial",
      "description": "Detailed clue text",
      "significance": "Why it matters",
      "discovered": true
    }
    // At least 6-8 clues
  ],
  "osintLeads": [
    {
      "id": "osint-1",
      "type": "social | darkweb | geo | financial",
      "target": "Target name or handle",
      "data": "Leaked info or log record"
    }
  ]
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
      dialogue: `Wait... where did you get that?! That's completely taken out of context! I didn't kill anyone, I swear!`,
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
