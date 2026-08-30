// Detective-L Master Case Database
// Created by Rakesh Soni - Featuring Real-World Indian & Global Unsolved Cases

export const INITIAL_CASES = [
  // 🇮🇳 REAL-WORLD INDIAN UNSOLVED COLD CASE
  {
    id: "case-stoneman-kolkata",
    title: "The Stoneman Murders: Kolkata 1989",
    subtitle: "India's Most Haunting Unsolved Serial Mystery",
    difficulty: "Master Sleuth (Real Cold Case)",
    estimatedTime: "25-35 mins",
    status: "UNSOLVED (REAL COLD CASE)",
    victim: "13 Pavement Dwellers across Central Kolkata",
    victimRole: "Homeless & Pavement Laborers in Howrah & Sealdah",
    timeOfDeath: "June - September 1989 (Between 01:00 and 04:00 IST)",
    location: "Dimly-lit pavements around Howrah Station, Sealdah, and Central Avenue, Kolkata",
    overview: "Over six months in 1989, 13 homeless pavement dwellers in Kolkata were crushed to death in their sleep with a single massive stone or concrete slab (weighing up to 30 kg). The killer operated silently under heavy monsoon rain during the 01:00 to 04:00 window. Despite massive police mobilizations and night curfews, the 'Stoneman' was never officially caught, leaving behind India's greatest forensic mystery.",
    crimeDetails: "Craniocerebral destruction caused by blunt force impact of a 30kg basalt/concrete slab dropped directly onto sleeping victims. No defensive wounds. No robbery motive. Murders ceased suddenly after police set up 24/7 armed night patrols in Sealdah.",
    culpritId: "suspect-tantrik", // Occultist ritual theory
    murderWeapon: "30kg Unworked Basalt Pavement Slab",
    actualMotive: "A disturbed occult practitioner believed ritualistic sacrifice under the monsoon dark moon would bestow supernatural immortality.",
    keyContradiction: "Bikram claimed he never left the Kalighat cremation grounds during the July 14 full moon, but night patrol logbooks at Sealdah rail siding record a man matching his exact description fleeing towards the tram depot at 02:45 IST.",
    
    // 5 REAL INVESTIGATIVE THEORIES & SUSPECTS
    suspects: [
      {
        id: "suspect-tantrik",
        name: "Bikram 'Kapalik' Shastri",
        role: "Rogue Aghori / Occult Practitioner",
        age: 46,
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
        personality: "Fanatical, speaks in cryptic Sanskrit verses, unyielding gaze, displays no fear of law.",
        voiceTone: "Deep, gravelly, low whisper, laughs at worldly justice.",
        publicAlibi: "I was meditating at the Kalighat Ghat continuously from dusk till dawn during all monsoon nights.",
        hiddenSecret: "He conducted midnight sacrificial rites along the railway tracks, believing the blood of sleeping innocents empowered his rituals.",
        isKiller: true,
        vulnerabilities: "Sealdah rail siding police log, vermilion and mustard oil stains found on his discarded saffron cloth near the 4th crime scene."
      },
      {
        id: "suspect-lambu-rafiq",
        name: "Mohammed 'Lambu' Rafiq",
        role: "Sealdah Railway Goods Siding Strongman",
        age: 38,
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        personality: "Aggressive, physically intimidating (6ft 4in), muscle for local extortion gangs.",
        voiceTone: "Loud, abusive Hindi/Bengali street dialect, highly irritable.",
        publicAlibi: "I was sleeping in the railway godown with my cargo loaders every night.",
        hiddenSecret: "He used heavy stones to intimidate squatter families who refused to pay protection hafta, but claims he never killed in cold blood.",
        isKiller: false,
        vulnerabilities: "Extortion ledger found in godown, witness who saw him threatening pavement vendors on Rabindra Sarani."
      },
      {
        id: "suspect-si-samar",
        name: "Sub-Inspector Samar Ghosh",
        role: "Lalbazar Police Detective Department Officer",
        age: 44,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
        personality: "Exhausted, cynical, under immense political pressure from Kolkata police headquarters.",
        voiceTone: "Weary, authoritarian, defensive of the police's failed night operations.",
        publicAlibi: "I was commanding the mobile patrol van #7 along Mahatma Gandhi Road from midnight to 05:00.",
        hiddenSecret: "His patrol van neglected the Sealdah sector between 02:00 and 03:30 because the officers were sleeping in an illicit tavern.",
        isKiller: false,
        vulnerabilities: "Patrol logbook discrepancies, unsigned duty transfer registers."
      },
      {
        id: "suspect-dr-aniruddha",
        name: "Dr. Aniruddha Sen",
        role: "State Mental Hospital Chief Psychiatrist",
        age: 52,
        avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
        personality: "Coldly analytical, academic, fascinated by criminal psychopathology.",
        voiceTone: "Scholarly, refined, speaks slowly, views the serial killer as an 'intellectual specimen'.",
        publicAlibi: "I was at the Calcutta Medical Club library writing my monograph on urban psychosis.",
        hiddenSecret: "An escaped violent patient under his care vanished in May 1989, and Dr. Sen hid the escape to protect his hospital's reputation.",
        isKiller: false,
        vulnerabilities: "Unreported patient escape log from Ward 4, confidential state asylum audit records."
      },
      {
        id: "suspect-gopal",
        name: "Gopal Das",
        role: "Night Pavement Tea Stall Owner & Eyewitness",
        age: 35,
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
        personality: "Nervous, superstitious, constantly looking over his shoulder.",
        voiceTone: "Trembling, fast-talking, terrified of police interrogations.",
        publicAlibi: "I closed my tea cart at 01:30 and slept beneath the Howrah bridge approach.",
        hiddenSecret: "He saw the killer carrying a heavy slab near Central Avenue but took a Rs. 500 bribe from the killer to stay silent.",
        isKiller: false,
        vulnerabilities: "Hidden stash of old 1980s currency notes under his tea stove, inconsistent statements given to Lalbazar detectives."
      }
    ],

    // HISTORICAL FORENSIC CLUES & EVIDENCE
    clues: [
      {
        id: "clue-basalt-slab",
        title: "30kg Basalt Pavement Slab",
        category: "physical",
        description: "A rectangular building slab (30kg) salvaged from a nearby tramway construction pit. Traces of vermilion powder, mustard oil, and victim blood.",
        significance: "The murder weapon. Requires exceptional upper-body strength. Vermilion traces suggest ritualistic preparation.",
        nodeType: "evidence",
        discovered: true,
        x: 420,
        y: 180
      },
      {
        id: "clue-sealdah-patrol-log",
        title: "Sealdah Rail Siding Police Night Log",
        category: "forensic",
        description: "Constable logbook from July 14, 1989: '02:45 IST - Tall bearded man in saffron-draped cloth observed fleeing through railway gate #3 following screams.'",
        significance: "Direct eyewitness timeline shatters Bikram Shastri's Kalighat alibi.",
        nodeType: "evidence",
        discovered: true,
        x: 650,
        y: 280
      },
      {
        id: "clue-monsoon-timeline",
        title: "Kolkata Police Lalbazar Dossier #89-KOL",
        category: "forensic",
        description: "All 13 attacks occurred during pitch-dark, rain-swept nights between 01:00 and 04:00 on isolated pavement stretches with zero lighting.",
        significance: "Proves killer had intimate local knowledge of Kolkata's unlit blind spots.",
        nodeType: "evidence",
        discovered: true,
        x: 180,
        y: 320
      },
      {
        id: "clue-vermilion-cloth",
        title: "Bloodied Saffron Cloth near Tram Depot",
        category: "physical",
        description: "Discarded torn cotton cloth found behind the Central Avenue tram shed. Stained with river silt, mustard oil, and human blood type B+.",
        significance: "Direct physical link to the occult practitioner.",
        nodeType: "evidence",
        discovered: false,
        x: 240,
        y: 480
      },
      {
        id: "clue-escaped-patient-file",
        title: "State Mental Hospital Ward 4 Escaped File",
        category: "digital",
        description: "Hospital incident report hidden by Dr. Sen: Patient 'Shambu' escaped on May 22, 1989. However, autopsy confirms Shambu died in a rail accident on June 1.",
        significance: "Clears Dr. Sen's escaped patient theory.",
        nodeType: "evidence",
        discovered: false,
        x: 720,
        y: 480
      }
    ],

    defaultConnections: [
      { id: "conn-stoneman-1", from: "suspect-tantrik", to: "clue-basalt-slab", label: "Ritual Vermilion Match" },
      { id: "conn-stoneman-2", from: "suspect-si-samar", to: "clue-sealdah-patrol-log", label: "Duty Log Record" }
    ],

    osintData: {
      socialLeaks: [
        {
          id: "osint-sm-1",
          target: "Lalbazar Crime Branch Archives (Kolkata Police)",
          platform: "State Police Gazette & Court Records (Kolkata)",
          timestamp: "1989-08-15 03:00 IST",
          snippet: "Confidential circular: 'Armed night vigil teams of 500 personnel deployed. Suspect is physically robust, works alone, operates along Sealdah-Howrah axis.'",
          threatLevel: "High",
          notes: "Official historical bulletin."
        }
      ],
      geoTraces: [
        {
          id: "geo-sm-1",
          subject: "Bikram 'Kapalik' Shastri",
          device: "Night Patrol Watchtower Sightings",
          logs: [
            { time: "00:30", tower: "Kalighat Temple Gate", status: "Seen leaving ghats" },
            { time: "02:15", tower: "Central Avenue Tram Shed", status: "Observed carrying burlap sack" },
            { time: "02:45", tower: "Sealdah Rail Gate #3", status: "Fled into rail yard after commotion" }
          ]
        }
      ],
      forensics: [
        {
          id: "forensic-sm-1",
          title: "Medical College Kolkata Autopsy Report #89-04",
          fileType: "Coroner Historical Record",
          preview: "Victim: Unidentified male pavement dweller (approx 35 yrs).\nCause of death: Immediate massive skull fracture from 30kg basalt slab.\nNo struggle marks. Victim was asleep at moment of impact.",
          verified: true
        }
      ]
    },

    crimeScene: {
      backgroundImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80",
      description: "Rain-swept Central Avenue tramway siding in 1989 Kolkata. Dim amber streetlamps reflecting off wet cobblestones, abandoned tram tracks, dark brick alleys.",
      hotspots: [
        {
          id: "hotspot-pavement-body",
          name: "Pavement Sleeping Spot",
          x: 45,
          y: 65,
          radius: 35,
          clueId: "clue-basalt-slab",
          discoveredText: "Beneath the canvas awning lies the heavy 30kg basalt slab covered in vermilion powder and bloodstains."
        },
        {
          id: "hotspot-tram-shed",
          name: "Central Tram Depot Shed",
          x: 75,
          y: 45,
          radius: 30,
          clueId: "clue-vermilion-cloth",
          discoveredText: "Behind the rusted iron tram carriage rests a torn saffron cloth smelling strongly of mustard oil and river silt."
        }
      ]
    }
  },

  // 🌐 REAL-WORLD INTERNATIONAL UNSOLVED COLD CASE
  {
    id: "case-zodiac-cipher",
    title: "The Zodiac Cipher & Lake Berryessa",
    subtitle: "The Unsolved 1969 Northern California Cipher Murders",
    difficulty: "Master Sleuth (Real Cold Case)",
    estimatedTime: "25-35 mins",
    status: "UNSOLVED (REAL COLD CASE)",
    victim: "Bryan Hartnell & Cecelia Shepard",
    victimRole: "College Students at Lake Berryessa, Napa County",
    timeOfDeath: "September 27, 1969 - 18:30 PST",
    location: "Lake Berryessa Shoreline, Napa County, California",
    overview: "In 1969, an enigmatic serial killer wearing an executioner's hood with a crosshair symbol ambushed two students at Lake Berryessa. He tied them with plastic clothesline and stabbed them before scrawling the dates of previous attacks onto the car door. He taunted police and newspapers with complex encrypted ciphers.",
    crimeDetails: "Victims bound with precut white hollow-core clothesline. Attacked with a custom 10-12 inch bayonet style knife. Car door written on with black felt pen: 'Vallejo 12-20-68, 7-4-69, Sept 27-69 - 6:30 by knife'.",
    culpritId: "suspect-arthur-allen",
    murderWeapon: "Custom 12-inch Bayonet & Precut Clothesline",
    actualMotive: "A pathological desire for public notoriety, psychological control over police, and sadistic thrill.",
    keyContradiction: "Arthur Leigh Allen claimed he was scuba diving in Carmel on September 27, 1969, but witnesses and gas station receipts place his Corvair near Lake Berryessa with bloody hunting knives in his trunk.",
    suspects: [
      {
        id: "suspect-arthur-allen",
        name: "Arthur Leigh Allen",
        role: "Former Schoolteacher & Chemist",
        age: 35,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        personality: "Childish, manipulative, wore a Zodiac brand watch with the exact crosshair logo.",
        voiceTone: "Monotone, pedantic, evasive when questioned about firearms and diving.",
        publicAlibi: "I went diving down at Carmel all weekend and stayed at a coastal motel.",
        hiddenSecret: "He told his friend Don Cheney in 1968 that he would call himself 'Zodiac' and kill couples with a flashlight attached to a gun.",
        isKiller: true,
        vulnerabilities: "Zodiac brand wristwatch, Royal typewriter matching cipher font, bloody knives in car trunk."
      },
      {
        id: "suspect-lawrence-kane",
        name: "Lawrence Kane",
        role: "Nightclub Manager & Electronics Tech",
        age: 45,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        personality: "Volatile, sustained severe brain injury in 1962 affecting emotional control.",
        voiceTone: "Fast, nervous, sharp New York accent.",
        publicAlibi: "I was working at the Sahara Tahoe hotel and casino.",
        hiddenSecret: "He stalked victim Darlene Ferrin at the Vallejo diner prior to her murder.",
        isKiller: false,
        vulnerabilities: "Casino timesheet gaps, identification by officer Fouke."
      },
      {
        id: "suspect-richard-gaikowski",
        name: "Richard Gaikowski",
        role: "Anti-War Newspaper Editor",
        age: 33,
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        personality: "Intellectual counterculture activist, obsessed with coded messages.",
        voiceTone: "Fast, energetic, argumentative.",
        publicAlibi: "I was editing articles in the San Francisco Good Times office.",
        hiddenSecret: "His newspaper published coded poems matching cipher patterns weeks before Zodiac letters arrived.",
        isKiller: false,
        vulnerabilities: "Voice recording matched by 911 dispatcher Nancy Slover."
      },
      {
        id: "suspect-ross-sullivan",
        name: "Ross Sullivan",
        role: "Riverside College Library Assistant",
        age: 28,
        avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
        personality: "Reclusive, 6ft 2in 250lbs, wore military fatigue jackets.",
        voiceTone: "Muffled, awkward, nervous.",
        publicAlibi: "I was in the college library stacks.",
        hiddenSecret: "He vanished for several days immediately after the 1966 Riverside murder and was hospitalized for psychiatric breakdown.",
        isKiller: false,
        vulnerabilities: "Library checkout records, military footprint matching size 10.5 Wing Walker boots."
      },
      {
        id: "suspect-gary-poste",
        name: "Gary Francis Poste",
        role: "Air Force Veteran & House Painter",
        age: 41,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
        personality: "Military disciplinarian, survivalist leader of a local mountain posse.",
        voiceTone: "Gruff, stern, authoritative.",
        publicAlibi: "I was painting houses in the High Sierra foothills.",
        hiddenSecret: "He possessed distinct forehead scars identical to the police composite sketch of Zodiac.",
        isKiller: false,
        vulnerabilities: "Forehead scar photo comparison, mountain campsite gun stash."
      }
    ],
    clues: [
      {
        id: "clue-car-door-message",
        title: "Karmann Ghia Car Door Scrawling",
        category: "physical",
        description: "Written in black marker on Bryan Hartnell's car door: 'Vallejo 12-20-68, 7-4-69, Sept 27-69 - 6:30 by knife' with the crosshair circle logo.",
        significance: "Direct signature linking the Lake Berryessa attack to previous Vallejo shootings.",
        nodeType: "evidence",
        discovered: true,
        x: 400,
        y: 200
      },
      {
        id: "clue-zodiac-watch",
        title: "Zodiac Sea Wolf Watch",
        category: "physical",
        description: "Found on Arthur Leigh Allen's wrist during 1971 police interview. The brand logo is an exact circle crossed with perpendicular lines.",
        significance: "Origin of the killer's chosen symbol and moniker.",
        nodeType: "evidence",
        discovered: true,
        x: 620,
        y: 250
      }
    ],
    defaultConnections: [
      { id: "conn-zod-1", from: "suspect-arthur-allen", to: "clue-zodiac-watch", label: "Crosshair Symbol Match" }
    ],
    osintData: {
      socialLeaks: [],
      geoTraces: [],
      forensics: []
    },
    crimeScene: {
      backgroundImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
      description: "Isolated shoreline of Lake Berryessa under dusk sun. Oak trees, dry grass, white Karmann Ghia parked near dirt road.",
      hotspots: []
    }
  },

  // 🏙️ ORIGINAL CYBER-NOIR MASTER CASE
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

    defaultConnections: [
      { id: "conn-1", from: "suspect-marcus", to: "clue-whiskey-glass", label: "V-99 Toxin Origin" },
      { id: "conn-2", from: "suspect-dante", to: "clue-cctv-blackout", label: "Root Access Overridden" },
      { id: "conn-3", from: "suspect-kaito", to: "clue-bloody-cufflinks", label: "Fled Scene & Stole Watch" }
    ],

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
  }
];
