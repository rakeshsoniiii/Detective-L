// Detective-L Master Case Database
// Created by Rakesh Soni

export const INITIAL_CASES = [
  {
    id: "case-penthouse-poisoning",
    title: "The Obsidian Penthouse Poisoning",
    subtitle: "The Fall of Tech Titan Victor Thorne",
    difficulty: "Master Sleuth",
    estimatedTime: "20-30 mins",
    status: "UNSOLVED",
    victim: "Victor Thorne (Age 54)",
    victimRole: "Founder & CEO of NeuroVance Biotech",
    timeOfDeath: "August 28, 2026 - 23:14 EST",
    location: "84th Floor Penthouse Suite, The Obsidian Tower, Manhattan",
    overview: "Billionaire tech visionary Victor Thorne was discovered dead at his mahogany desk inside his biometrically locked penthouse. The glass of 50-year-old Macallan scotch contained lethal traces of a synthesized synthetic neurotoxin 'V-99'. Five key individuals with access and motives were inside the tower that night.",
    crimeDetails: "Toxicology confirms cardiac arrest triggered by acute potassium-neurotoxin compound V-99 within 90 seconds of ingestion. The study door was locked from the inside via biometric smart lock. CCTV footage from the 84th floor corridor went black between 23:05 and 23:16.",
    culpritId: "suspect-marcus", // Dr. Marcus Vance
    murderWeapon: "V-99 Neurotoxin injected into ice cubes",
    actualMotive: "Victor discovered Dr. Vance was conducting illicit human gene trials and threatened to expose him to the FDA and strip his patents.",
    keyContradiction: "Dr. Vance claimed his specialized ultra-cold peptide freezer was never opened after 20:00, but OSINT IoT smart lab telemetry proves the cryogenic seal was broken at 22:52 with his biometric keycard.",
    
    // 5 PRIMARY SUSPECTS
    suspects: [
      {
        id: "suspect-elena",
        name: "Elena Rostova",
        role: "Chief Operating Officer & Co-Founder",
        age: 41,
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
        personality: "Cold, razor-sharp, calculating corporate executive. Unflinching under routine scrutiny.",
        voiceTone: "Authoritative, crisp British accent, dismissive of police bureaucracy.",
        publicAlibi: "I was on an encrypted Zoom board meeting with our Tokyo syndicate investors from 22:15 to 23:45 in the 82nd floor conference suite.",
        hiddenSecret: "She secretly embezzled $34 Million from company accounts to cover offshore crypto derivative losses.",
        isKiller: false,
        vulnerabilities: "Financial audit logs, encrypted Swiss transfer receipts, Tokyo call VPN logs showing her webcam was looped for 15 minutes."
      },
      {
        id: "suspect-marcus",
        name: "Dr. Marcus Vance",
        role: "Chief Biochemist & Personal Physician",
        age: 49,
        avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
        personality: "Intellectually arrogant, neurotic, speaks with clinical precision and condescension.",
        voiceTone: "Methodical, speaks slowly, frequently adjusts his glasses, gets irritable when his medical genius is questioned.",
        publicAlibi: "I was calibrating the spectrometer in the Sub-Level 2 Bio-Lab until midnight. The lab is completely restricted.",
        hiddenSecret: "He formulated the lethal V-99 neurotoxin and coated slow-melting spherical ice cubes left in Victor's private freezer bar.",
        isKiller: true,
        vulnerabilities: "Sub-level IoT freezer logs, missing 5ml vial of V-99, chemical residue under his manicured nails, Victor's draft FDA whistleblower email."
      },
      {
        id: "suspect-chloe",
        name: "Chloe Thorne",
        role: "Estranged Stepdaughter & Model",
        age: 26,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        personality: "Defiant, emotional, resentful of her stepfather's controlling behavior.",
        voiceTone: "Edgy, sarcastic, defensive, speaks quickly when agitated.",
        publicAlibi: "I stormed out of the penthouse at 21:30 after a screaming match with Victor. I was partying at Club Velvet in Soho all night.",
        hiddenSecret: "She sneaked back into the building at 22:45 to steal Victor's black ledger to find evidence of her mother's inheritance trust.",
        isKiller: false,
        vulnerabilities: "VIP Club CCTV timestamps, parking garage access swipe card at 22:42, stolen diamond pendant found in her purse."
      },
      {
        id: "suspect-dante",
        name: "Dante 'Zero' Silva",
        role: "Director of Cyber Security & Head Hacker",
        age: 34,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        personality: "Paranoid, cynical, extremely tech-savvy, speaks in tech jargon and cybersecurity slang.",
        voiceTone: "Muffled, guarded, avoids direct eye contact, constantly tapping fingers.",
        publicAlibi: "I was in the server room on Floor 80 monitoring the network security integrity during the VIP gathering.",
        hiddenSecret: "He intentionally wiped the corridor CCTV logs between 23:05 and 23:16 because he was installing a hardware keylogger on Victor's terminal for a black hat buyer.",
        isKiller: false,
        vulnerabilities: "Hardware keylogger interceptor found on Victor's USB bus, encrypted DarkNet chat with 'ShadowBroker', crypto payout."
      },
      {
        id: "suspect-kaito",
        name: "Kaito Tanaka",
        role: "Personal Butler & Estate Manager",
        age: 58,
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        personality: "Impeccably polite, quiet, traditional, observant of every tiny detail.",
        voiceTone: "Subdued, reverent, formal Japanese mannerisms, unwavering composure.",
        publicAlibi: "I served Mr. Thorne his scotch at 22:30, refreshed the ice bucket from the private pantry, and retired to the staff quarters to polish the silver.",
        hiddenSecret: "He is deep in illegal gambling debt with the Yakuza and stole Victor's rare $500,000 Patek Philippe watch right after finding the corpse before calling 911.",
        isKiller: false,
        vulnerabilities: "Blood smear on silver cufflinks in the laundry chute, stolen Patek Philippe watch hidden in the pantry ceiling tile."
      }
    ],

    // CLUES & EVIDENCE
    clues: [
      {
        id: "clue-whiskey-glass",
        title: "Poisoned Crystal Tumbler",
        category: "forensic",
        description: "A crystal glass containing melted spherical ice and 15ml of 50-year scotch. Chemical analysis reveals 800mg of synthetic neurotoxin V-99.",
        significance: "The lethal vehicle. The toxin was impregnated inside the slow-melting ice sphere, delaying poisoning by ~40 minutes after serving.",
        nodeType: "evidence",
        discovered: true,
        x: 420,
        y: 180
      },
      {
        id: "clue-cctv-blackout",
        title: "84th Floor CCTV Blackout",
        category: "digital",
        description: "All optical and thermal sensors on the 84th floor corridor were overridden with a manual administrative loop from 23:05 to 23:16.",
        significance: "Proves internal security tampering. Requires level 5 administrative root credentials to execute.",
        nodeType: "evidence",
        discovered: true,
        x: 650,
        y: 290
      },
      {
        id: "clue-autopsy-report",
        title: "Coroner's Autopsy Dossier #26-881",
        category: "forensic",
        description: "Victim died of instant neuromuscular paralysis and cardiac arrest at 23:14 (+/- 3 mins). Stomach contents show scotch, traces of rare peptide binder.",
        significance: "Pinpoints the exact time of death. The peptide binder is proprietary to NeuroVance's internal lab.",
        nodeType: "evidence",
        discovered: true,
        x: 180,
        y: 320
      },
      {
        id: "clue-draft-email",
        title: "Victor's Draft Whistleblower Email",
        category: "digital",
        description: "Unsent email on Victor's computer addressed to FDA Criminal Investigations division regarding 'Illegal Phase 3 trials & unauthorized neurotoxins by Dr. Vance'.",
        significance: "Direct murder motive for Dr. Marcus Vance. Sent timestamp draft: 21:40 on the night of the murder.",
        nodeType: "evidence",
        discovered: false,
        x: 220,
        y: 490
      },
      {
        id: "clue-freezer-log",
        title: "Cryogenic Lab Access Telemetry",
        category: "digital",
        description: "Sub-Level 2 Bio-Lab Cryo-Vault Log: 'V-99 Peptide Storage Unit opened at 22:52:11 by Keycard #004 (Dr. M. Vance)'.",
        significance: "Directly shatters Dr. Vance's alibi that he never opened the cryo-unit after 20:00.",
        nodeType: "evidence",
        discovered: false,
        x: 720,
        y: 480
      },
      {
        id: "clue-ice-sphere-mold",
        title: "Cryo-Grade Silicone Ice Mold",
        category: "physical",
        description: "Found inside the executive pantry freezer. Silicone spherical mold with microscopic residue of potassium neurotoxin and pipette markings.",
        significance: "Proves premeditated delivery mechanism. Someone prepared the poisoned ice prior to the evening.",
        nodeType: "evidence",
        discovered: false,
        x: 430,
        y: 430
      },
      {
        id: "clue-black-ledger",
        title: "Victor's Handwritten Safe Ledger",
        category: "physical",
        description: "Found inside Chloe Thorne's backpack. Contains records of inheritance trusts and a newly signed will disinheriting Chloe.",
        significance: "Explains Chloe's presence in the building at 22:45, but doesn't connect her to the biochemical toxin.",
        nodeType: "evidence",
        discovered: true,
        x: 160,
        y: 160
      },
      {
        id: "clue-bloody-cufflinks",
        title: "Silver Cufflinks in Laundry Chute",
        category: "physical",
        description: "Pair of sterling silver monogrammed cufflinks found wrapped in linen with a smear of Victor's blood and fingerprints matching Butler Kaito.",
        significance: "Kaito panicked upon finding Victor's body and stole his watch, cutting himself on the broken decanter.",
        nodeType: "evidence",
        discovered: true,
        x: 820,
        y: 190
      }
    ],

    // DEFAULT PINBOARD NODES & CONNECTIONS
    defaultConnections: [
      { id: "conn-1", from: "suspect-marcus", to: "clue-whiskey-glass", label: "V-99 Toxin Origin" },
      { id: "conn-2", from: "suspect-dante", to: "clue-cctv-blackout", label: "Root Access Overridden" },
      { id: "conn-3", from: "suspect-kaito", to: "clue-bloody-cufflinks", label: "Fled Scene & Stole Watch" }
    ],

    // OSINT & WEB INTELLIGENCE RECORDS
    osintData: {
      socialLeaks: [
        {
          id: "osint-1",
          target: "Elena Rostova (@Elena_Rostova_COO)",
          platform: "X / Twitter & LinkedCorporate",
          timestamp: "2026-08-28 22:40 EST",
          snippet: "Automated bot post: 'Proud to announce NeuroVance Q3 milestones with our Tokyo partners!' - IP Geolocation trace reveals post came from a scheduled Hootsuite queue from Cyprus VPN.",
          threatLevel: "Medium",
          notes: "Elena was using automation to fake her active presence during the evening."
        },
        {
          id: "osint-2",
          target: "Dante Silva (Handle: @ZeroDay_Ghost)",
          platform: "BreachForums / DarkNet",
          timestamp: "2026-08-27 03:12 EST",
          snippet: "Encrypted Escrow Deposit: 4.2 BTC ($280,000) received from anonymous buyer for 'Physical Hardware Exfiltration at Obsidian Tower'.",
          threatLevel: "High",
          notes: "Dante was hired for corporate espionage, explaining why he shut down CCTV for 11 minutes."
        }
      ],
      geoTraces: [
        {
          id: "geo-1",
          subject: "Chloe Thorne",
          device: "iPhone 16 Pro (IMEI: 359128...)",
          logs: [
            { time: "21:35", tower: "Tower 44 (Midtown)", status: "Departed Obsidian Tower" },
            { time: "22:10", tower: "Tower 12 (SoHo)", status: "Arrived Club Velvet" },
            { time: "22:42", tower: "Tower 44 (Midtown)", status: "Returned to Obsidian Parking Garage" },
            { time: "23:05", tower: "Tower 44 (Midtown)", status: "Departed Obsidian Parking Garage via Uber" }
          ]
        },
        {
          id: "geo-2",
          subject: "Dr. Marcus Vance",
          device: "Bio-Sensor Smartwatch (MAC: 4A:88:C3...)",
          logs: [
            { time: "20:00", tower: "Sub-Level 2 Bio-Lab", status: "Heart Rate: 68 BPM" },
            { time: "22:50", tower: "Sub-Level 2 Vault", status: "Heart Rate: 138 BPM (Adrenaline Spike)" },
            { time: "23:18", tower: "Sub-Level 2 Bio-Lab", status: "Heart Rate: 112 BPM" }
          ]
        }
      ],
      forensics: [
        {
          id: "forensic-1",
          title: "Victor's Encrypted Phone (Signal Chat Logs)",
          fileType: "SQLite DB / Decrypted",
          preview: "Victor to Dr. Vance (21:15): 'I saw the lab audit, Marcus. You manufactured V-99 against my explicit orders. Tomorrow morning, the board and federal marshals take over your lab.'\nDr. Vance (21:18): 'Victor, please. Let's discuss this over a drink in your study before you destroy my life's work.'",
          verified: true
        },
        {
          id: "forensic-2",
          title: "Pantry Refrigerator Ice Maker EXIF & Firmware Log",
          fileType: "IoT Sensor Dump",
          preview: "Ice compartment opened manually at 21:45 using maintenance override key. 1x spherical specialty cube inserted into top tray.",
          verified: true
        }
      ]
    },

    // CRIME SCENE HOTSPOTS
    crimeScene: {
      backgroundImage: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80",
      description: "Victor Thorne's 84th-floor study. Dark mahogany paneling, city skyline visible through floor-to-ceiling panoramic glass, Persian rugs, mahogany desk with deceased victim slumped forward.",
      hotspots: [
        {
          id: "hotspot-desk",
          name: "Mahogany Desk & Body",
          x: 48,
          y: 52,
          radius: 35,
          clueId: "clue-whiskey-glass",
          discoveredText: "Slumped over the desk is Victor Thorne. Beside his right hand rests an overturned crystal tumbler with a half-melted ice sphere and faint almond odor."
        },
        {
          id: "hotspot-computer",
          name: "Unlocked Terminal & Monitor",
          x: 62,
          y: 42,
          radius: 28,
          clueId: "clue-draft-email",
          discoveredText: "The monitor displays a draft email to the FDA regarding unauthorized neurotoxin synthesis by Dr. Marcus Vance."
        },
        {
          id: "hotspot-safe",
          name: "Wall Safe behind Painting",
          x: 22,
          y: 38,
          radius: 26,
          clueId: "clue-black-ledger",
          discoveredText: "The oil painting is swung open. The biometric keypad was accessed with Chloe's emergency backup passcode."
        },
        {
          id: "hotspot-pantry",
          name: "Private Bar & Freezer",
          x: 82,
          y: 60,
          radius: 30,
          clueId: "clue-ice-sphere-mold",
          discoveredText: "UV Luminol reveals chemical glow around the ice mold in the freezer tray. The mold matches the dimension of the ice sphere in the murder tumbler."
        }
      ]
    }
  },

  {
    id: "case-neon-syndicate",
    title: "The Neon Syndicate Vault Heist",
    subtitle: "The Assassination of Cyber Broker Raven",
    difficulty: "Veteran Detective",
    estimatedTime: "25 mins",
    status: "UNSOLVED",
    victim: "Kaelen 'Raven' Voss (Age 38)",
    victimRole: "Underground Data Broker & Shadow Escrow Manager",
    timeOfDeath: "September 14, 2026 - 02:40 UTC",
    location: "Sub-Level Cyber Vault 09, Neo-Shinjuku District",
    overview: "Underground intelligence broker Raven was found executed via a micro-pulse electromagnetic discharge through his neuro-jack in an EMP-shielded bunker. A decrypted ledger containing names of corrupted politicians was stolen from his cold-storage quantum drive.",
    crimeDetails: "Victim's cranial neural interface was fried with a military-grade 40,000V over-voltage pulse device. The vault's airlock required three synchronized biometric keys to open.",
    culpritId: "suspect-cipher",
    murderWeapon: "EMP Neural Overload Discharge Disruptor",
    actualMotive: "Cipher discovered Raven was about to sell Cipher's true identity to Interpol in exchange for full diplomatic immunity.",
    keyContradiction: "Cipher claimed they were on a flight to Zurich during the EMP blast, but the manifest was falsified via an automated quantum backdoor.",
    suspects: [
      {
        id: "suspect-cipher",
        name: "Valerie 'Cipher' Kane",
        role: "Lead Systems Architect & Ghost Hacker",
        age: 31,
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
        personality: "Hyper-focused, enigmatic, talks in riddles and cryptographic terminology.",
        voiceTone: "Quiet, calm, whispering monotone, chillingly confident.",
        publicAlibi: "I boarded Swiss Air flight LX-19 to Zurich at 01:15 UTC. My passport stamp is verified.",
        hiddenSecret: "She used a deepfake synthetic double to board the flight while she remained in the city to execute Raven.",
        isKiller: true,
        vulnerabilities: "Flight boarding gate facial recognition glitch at 01:08 UTC, EMP capacitor residue on her titanium prosthetic sleeve."
      },
      {
        id: "suspect-tatsuya",
        name: "Tatsuya Morita",
        role: "Syndicate Enforcer",
        age: 44,
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
        personality: "Intimidating, brusque, loyal to the old Yakuza code.",
        voiceTone: "Deep, gravelly, aggressive.",
        publicAlibi: "I was collecting debts at the Golden Dragon Arcade until dawn.",
        hiddenSecret: "He was skimming protection money from the syndicate's underground pachinko parlors.",
        isKiller: false,
        vulnerabilities: "Pachinko ledger discrepancy, arcade video footage."
      },
      {
        id: "suspect-agent-ross",
        name: "Special Agent Ronald Ross",
        role: "Interpol Cyber Crimes Taskforce",
        age: 51,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
        personality: "By-the-book bureaucrat, exhausted, chain-smoker.",
        voiceTone: "Weary, defensive, legalistic.",
        publicAlibi: "I was filing surveillance reports at the embassy annex all night.",
        hiddenSecret: "He was accepting confidential intelligence drops from Raven in exchange for burying federal warrants.",
        isKiller: false,
        vulnerabilities: "Burner phone SMS thread with Raven, encrypted embassy drop logs."
      },
      {
        id: "suspect-mira",
        name: "Mira Lin",
        role: "Vault Hardware Engineer",
        age: 29,
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
        personality: "Nervous, brilliant hardware technician, constantly fidgeting.",
        voiceTone: "High pitched, stammering when pressured.",
        publicAlibi: "I was at home testing new biometric optical sensors.",
        hiddenSecret: "She sold an uncalibrated EMP capacitor circuit on the black market to pay off medical bills.",
        isKiller: false,
        vulnerabilities: "Dark web hardware transaction ledger matching the weapon's serial signature."
      },
      {
        id: "suspect-dax",
        name: "Dax Sterling",
        role: "Rival Data Broker",
        age: 42,
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
        personality: "Flashy, narcissistic, wears bespoke high-tech suits.",
        voiceTone: "Smug, theatrical, mocking.",
        publicAlibi: "Hosting a VIP poker game at the Sky Lounge with 20 witnesses.",
        hiddenSecret: "He lost $2 Million to Raven in an algorithmic crypto wager two days ago.",
        isKiller: false,
        vulnerabilities: "Casino security tapes, bank lien notices."
      }
    ],
    clues: [
      {
        id: "clue-emp-disruptor",
        title: "Over-Volted Neural Disruptor",
        category: "forensic",
        description: "The custom EMP pulse unit used to execute Raven. The micro-transformer bears serial marks traced to Mira Lin's workshop and Cipher's titanium sleeve fitting.",
        significance: "The murder weapon.",
        nodeType: "evidence",
        discovered: true,
        x: 400,
        y: 200
      },
      {
        id: "clue-quantum-drive",
        title: "Emptied Quantum Storage Cell",
        category: "digital",
        description: "Raven's cold-storage drive, completely wiped clean using a military-grade zero-fill script.",
        significance: "Proves data exfiltration motive.",
        nodeType: "evidence",
        discovered: true,
        x: 620,
        y: 250
      }
    ],
    defaultConnections: [
      { id: "conn-synd-1", from: "suspect-cipher", to: "clue-emp-disruptor", label: "Prosthetic Sleeve Coupling Match" }
    ],
    osintData: {
      socialLeaks: [],
      geoTraces: [],
      forensics: []
    },
    crimeScene: {
      backgroundImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80",
      description: "Sub-Level Cyber Vault 09. Servers glowing in neon cyan and magenta, fried wires emitting thin smoke, heavy blast doors.",
      hotspots: []
    }
  }
];
