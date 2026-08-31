// Detective-L Curated Real-World Case Files & Blank Case Workspace
// Created by Rakesh Soni - Dedicated to Real Criminal Investigation & Cold Case Forensics

export const INITIAL_CASES = [
  // 1. 🇮🇳 REAL INDIAN COLD CASE: The Stoneman Murders (Kolkata, 1989)
  {
    id: "case-stoneman-kolkata",
    title: "The Stoneman Murders (Kolkata 1989)",
    subtitle: "India's Most Notorious Unsolved Serial Pavement Murders",
    difficulty: "Real Cold Case (Historical)",
    estimatedTime: "Active Investigation",
    status: "UNSOLVED (REAL COLD CASE)",
    victim: "13 Pavement Dwellers across Howrah & Central Kolkata",
    victimRole: "Homeless Night Laborers & Pavement Dwellers",
    timeOfDeath: "June - September 1989 (01:00 - 04:00 IST)",
    location: "Central Avenue, Sealdah Station Siding & Howrah, Kolkata",
    overview: "Between June and September 1989, 13 homeless pavement dwellers in Kolkata were bludgeoned in their sleep with heavy stone slabs (up to 30 kg). The killer struck only during pitch-dark, monsoon-rain nights in unlit alleys. No valuables were stolen, no eyewitnesses came forward, and the murders ceased abruptly when armed police night patrols were deployed.",
    crimeDetails: "Craniocerebral blunt force trauma caused by dropped 30kg basalt/concrete stone slab. No defensive wounds. Victims asleep at time of impact.",
    culpritId: "suspect-tantrik",
    murderWeapon: "30kg Basalt Pavement Slab",
    actualMotive: "Suspected ritualistic occult sacrifices conducted along the railway tracks during monsoon new moon cycles.",
    keyContradiction: "The occult practitioner Bikram Shastri claimed he was at Kalighat Ghat all night, but Lalbazar police night records place a tall saffron-clad suspect fleeing Sealdah Rail Gate #3 at 02:45 IST.",
    suspects: [
      {
        id: "suspect-tantrik",
        name: "Bikram 'Kapalik' Shastri",
        role: "Rogue Aghori & Occult Practitioner",
        age: 46,
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
        personality: "Fanatical, unyielding, speaks in cryptic verses, indifferent to legal authority.",
        voiceTone: "Deep, gravelly, low whisper, laughs at worldly justice.",
        publicAlibi: "I was meditating at Kalighat Ghat continuously from dusk till dawn during all monsoon nights.",
        hiddenSecret: "He conducted midnight rites along the railway tracks, believing blood sacrifices yielded supernatural powers.",
        isKiller: true,
        vulnerabilities: "Sealdah rail siding police log, vermilion powder and mustard oil traces found near the 4th crime scene."
      },
      {
        id: "suspect-lambu-rafiq",
        name: "Mohammed 'Lambu' Rafiq",
        role: "Sealdah Railway Goods Siding Strongman",
        age: 38,
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        personality: "Aggressive, physically intimidating (6ft 4in), enforcement muscle for local extortion racket.",
        voiceTone: "Loud, street dialect, highly irritable when pressed by police.",
        publicAlibi: "I was sleeping in the railway godown with cargo loaders every night.",
        hiddenSecret: "He extorted weekly hafta from pavement squatters and threatened non-payers with heavy stones.",
        isKiller: false,
        vulnerabilities: "Extortion ledger found in godown, witnesses on Rabindra Sarani."
      },
      {
        id: "suspect-si-samar",
        name: "Sub-Inspector Samar Ghosh",
        role: "Lalbazar Police Mobile Patrol Commander",
        age: 44,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
        personality: "Exhausted, cynical, defensive under intense pressure from Kolkata Police HQ.",
        voiceTone: "Authoritarian, weary, defensive of police response delays.",
        publicAlibi: "I was commanding mobile patrol van #7 along MG Road continuously from midnight to 05:00.",
        hiddenSecret: "His patrol van abandoned their sector between 02:00 and 03:30 because the officers fell asleep inside an illicit tavern.",
        isKiller: false,
        vulnerabilities: "Patrol logbook gaps, unsigned duty transfer registers."
      },
      {
        id: "suspect-dr-aniruddha",
        name: "Dr. Aniruddha Sen",
        role: "State Mental Hospital Chief Psychiatrist",
        age: 52,
        avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
        personality: "Academic, detached, fascinated by criminal psychopathology.",
        voiceTone: "Scholarly, precise, views the serial attacks as a psychiatric case study.",
        publicAlibi: "I was at the Medical Club library reviewing psychiatric monographs.",
        hiddenSecret: "An escaped violent patient under his care vanished in May 1989; Dr. Sen covered up the escape to protect hospital funding.",
        isKiller: false,
        vulnerabilities: "Ward 4 unreported patient escape records, confidential state asylum audit files."
      },
      {
        id: "suspect-gopal",
        name: "Gopal Das",
        role: "Night Pavement Tea Vendor & Eyewitness",
        age: 35,
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
        personality: "Nervous, superstitious, constantly looking over his shoulder.",
        voiceTone: "Trembling, fast-talking, terrified of police interrogations.",
        publicAlibi: "I closed my tea cart at 01:30 and slept beneath the Howrah bridge approach.",
        hiddenSecret: "He saw a figure carrying a heavy stone near Central Avenue and accepted Rs. 500 hush money to stay silent.",
        isKiller: false,
        vulnerabilities: "Hidden cache of 1980s currency under his stove, contradictory witness statements."
      }
    ],
    clues: [
      {
        id: "clue-basalt-slab",
        title: "30kg Basalt Pavement Slab",
        category: "physical",
        description: "A rectangular building slab (30kg) salvaged from a tramway construction pit. Traces of vermilion powder, mustard oil, and blood type B+.",
        significance: "The murder weapon. Requires exceptional strength. Vermilion traces indicate ritualistic preparation.",
        nodeType: "evidence",
        discovered: true,
        x: 420,
        y: 180
      },
      {
        id: "clue-sealdah-patrol-log",
        title: "Sealdah Rail Siding Police Night Log",
        category: "forensic",
        description: "Constable logbook from July 14, 1989: '02:45 IST - Tall bearded man in saffron cloth observed fleeing through railway gate #3 following screams.'",
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
        description: "All 13 attacks occurred during pitch-dark, rain-swept nights between 01:00 and 04:00 on isolated pavement stretches with zero street lighting.",
        significance: "Proves the killer had intimate knowledge of local blind spots and night patrol rotations.",
        nodeType: "evidence",
        discovered: true,
        x: 180,
        y: 320
      },
      {
        id: "clue-vermilion-cloth",
        title: "Bloodied Saffron Cloth near Tram Depot",
        category: "physical",
        description: "Discarded torn cotton cloth found behind the Central Avenue tram shed. Stained with river silt, mustard oil, and human blood.",
        significance: "Direct physical link to the occult practitioner.",
        nodeType: "evidence",
        discovered: false,
        x: 240,
        y: 480
      }
    ],
    defaultConnections: [
      { id: "conn-sm-1", from: "suspect-tantrik", to: "clue-basalt-slab", label: "Ritual Vermilion Match" },
      { id: "conn-sm-2", from: "suspect-si-samar", to: "clue-sealdah-patrol-log", label: "Duty Log Record" }
    ],
    osintData: {
      socialLeaks: [
        {
          id: "osint-sm-1",
          target: "Lalbazar Crime Branch Archives (Kolkata Police)",
          platform: "State Police Gazette & Court Records (Kolkata)",
          timestamp: "1989-08-15 03:00 IST",
          snippet: "Confidential circular: 'Armed night vigil teams deployed. Suspect is physically robust, works alone, operates along Sealdah-Howrah axis.'",
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
        }
      ]
    }
  },

  // 2. 🇮🇳 REAL INDIAN COLD CASE: The 2008 Noida Double Murder Case
  {
    id: "case-noida-2008",
    title: "The Noida Double Murder Mystery (2008)",
    subtitle: "India's Most Controverted Forensic & Investigative Case",
    difficulty: "Real Cold Case (Forensics Intensive)",
    estimatedTime: "Active Investigation",
    status: "UNSOLVED (ACQUITTED ON APPEAL)",
    victim: "14-Year-Old Girl & Domestic Assistant (Hemraj)",
    victimRole: "High School Student & Resident Domestic Worker",
    timeOfDeath: "May 15-16, 2008 (Between 00:00 and 02:00 IST)",
    location: "Flat L-32, Jalvayu Vihar, Sector 25, Noida, Uttar Pradesh",
    overview: "On May 16, 2008, a 14-year-old girl was found dead in her bedroom with her throat slit with surgical precision. Initially, missing domestic worker Hemraj was named prime suspect, until his decomposed body was discovered on the locked terrace of the same apartment a day later. The case saw multiple agencies, conflicting CBI charge sheets, botched crime scene preservation, touch DNA disputes, and eventual high court acquittals.",
    crimeDetails: "Both victims suffered blunt force injuries to the head (golf club/heavy instrument) followed by carotid artery severing with a fine surgical blade (scalpel). No signs of forced entry on the main middle-mesh door.",
    culpritId: "suspect-compounder-krishna",
    murderWeapon: "Dental Scalpel & Golf Club No. 5",
    actualMotive: "Violent confrontation following an unauthorized gathering in Hemraj's room involving domestic workers from neighboring flats.",
    keyContradiction: "Krishna claimed he was in his ancestral village on the night of May 15, but mobile tower CDR logs from Sector 25 Noida showed his phone actively receiving calls from Hemraj's room at 23:45 IST.",
    suspects: [
      {
        id: "suspect-compounder-krishna",
        name: "Krishna Thadarai",
        role: "Dental Clinic Compounder & Associate",
        age: 28,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        personality: "Guarded, evasive during narco-analysis interviews, harborer of workplace resentment.",
        voiceTone: "Low, defensive, frequently alters timeline details.",
        publicAlibi: "I was at my home in Moradabad throughout the evening of May 15.",
        hiddenSecret: "He was drinking in Hemraj's room with Rajkumar and Vijay Mandal on the night of the crime.",
        isKiller: true,
        vulnerabilities: "Sector 25 cell tower CDR records, narco-analysis video transcripts, purple khukuri seized by CBI Team 1."
      },
      {
        id: "suspect-rajkumar",
        name: "Rajkumar",
        role: "Domestic Worker at Durrani Residence",
        age: 26,
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        personality: "Subdued, fearful, claims innocence under police interrogation.",
        voiceTone: "Tense, stammering, avoids eye contact.",
        publicAlibi: "I was asleep at my employer's home across the street.",
        hiddenSecret: "He was present in the flat during the initial altercation but fled via the rear service stairs.",
        isKiller: false,
        vulnerabilities: "Blood-stained pillowcase recovered from his servant quarter, mobile tower pings."
      },
      {
        id: "suspect-dr-father",
        name: "Dr. Rajesh (Father)",
        role: "Dentist & Father of Victim",
        age: 49,
        avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
        personality: "Stoic, emotionally broken, bewildered by conflicting media trials and forensic leaks.",
        voiceTone: "Formal, clinical, deeply grief-stricken.",
        publicAlibi: "We were sleeping in our bedroom with the split AC running and heard nothing until 06:00.",
        hiddenSecret: "He cleaned the room and touched evidence before forensic police sealed the apartment, fearing media contamination.",
        isKiller: false,
        vulnerabilities: "Golf club set missing club #5, internet router activity logs between 00:00 and 03:00."
      },
      {
        id: "suspect-dr-mother",
        name: "Dr. Nupur (Mother)",
        role: "Dentist & Mother of Victim",
        age: 46,
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
        personality: "Composed, highly articulate, traumatized by the protracted trials.",
        voiceTone: "Firm, educated, critical of initial UP Police lapses.",
        publicAlibi: "I was asleep in our master bedroom after putting our daughter to bed at 23:00.",
        hiddenSecret: "She mistakenly locked the terrace door the following morning without checking the roof.",
        isKiller: false,
        vulnerabilities: "Disputed touch DNA reports from CDFD Hyderabad, key handover logs."
      },
      {
        id: "suspect-vijay-mandal",
        name: "Vijay Mandal",
        role: "Neighboring Flat Helper",
        age: 24,
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
        personality: "Nervous, easily intimidated, admitted to visiting Hemraj for drinks.",
        voiceTone: "Hesitant, speaks in broken Hindi.",
        publicAlibi: "I went back to my room by 22:30.",
        hiddenSecret: "He witnessed the argument escalate over an illicit mobile phone transfer.",
        isKiller: false,
        vulnerabilities: "Fingerprints on Sula wine bottle found in Hemraj's room."
      }
    ],
    clues: [
      {
        id: "clue-scalpel-cut",
        title: "Forensic Post-Mortem: Surgical Incision",
        category: "forensic",
        description: "AIIMS & District Hospital Autopsy: Carotid arteries severed with an ultra-fine, surgically sharp single-stroke blade. No ragged laceration.",
        significance: "Matches dental/surgical scalpel used in medical clinics.",
        nodeType: "evidence",
        discovered: true,
        x: 400,
        y: 180
      },
      {
        id: "clue-terrace-lock",
        title: "Terrace Blood Trail & Stained Lock",
        category: "physical",
        description: "Heavy bloody drag mark leading from the hallway to the rooftop terrace door, which was secured with a latch from the outside.",
        significance: "Proves Hemraj was attacked inside the flat and dragged to the roof by at least two individuals.",
        nodeType: "evidence",
        discovered: true,
        x: 650,
        y: 280
      },
      {
        id: "clue-cdr-sector25",
        title: "Sector 25 Noida Cell Tower CDR Logs",
        category: "digital",
        description: "Tower 182-Noida CDR: Krishna's phone pinged Sector 25 at 23:48:12 IST, receiving a 42-second call from Hemraj's handset.",
        significance: "Completely demolishes Krishna's Moradabad alibi.",
        nodeType: "evidence",
        discovered: true,
        x: 180,
        y: 320
      }
    ],
    defaultConnections: [
      { id: "conn-noida-1", from: "suspect-compounder-krishna", to: "clue-cdr-sector25", label: "CDR Location Match" }
    ],
    osintData: {
      socialLeaks: [],
      geoTraces: [],
      forensics: []
    },
    crimeScene: {
      backgroundImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
      description: "Apartment Flat L-32, Jalvayu Vihar. Quiet residential middle-class complex in Sector 25, Noida.",
      hotspots: []
    }
  },

  // 3. 🌐 REAL GLOBAL COLD CASE: The Zodiac Cipher & Lake Berryessa (1969)
  {
    id: "case-zodiac-cipher",
    title: "The Zodiac Cipher: Lake Berryessa (1969)",
    subtitle: "The Unsolved Northern California Cipher Ambush",
    difficulty: "Real Cold Case (Historical)",
    estimatedTime: "Active Investigation",
    status: "UNSOLVED (REAL COLD CASE)",
    victim: "Bryan Hartnell & Cecelia Shepard",
    victimRole: "College Students at Lake Berryessa",
    timeOfDeath: "September 27, 1969 - 18:30 PST",
    location: "Lake Berryessa Shoreline, Napa County, California",
    overview: "In September 1969, an unknown killer in a custom black executioner's hood embroidered with a crosshair symbol ambushed two college students at Lake Berryessa. He bound them with precut clothesline and attacked them with a custom 12-inch bayonet before scrawling previous attack dates on the car door and calling police from a public telephone booth.",
    crimeDetails: "Victims bound with hollow-core plastic clothesline. Attacked with a double-edged 12-inch bayonet. Car door written on with black felt pen: 'Vallejo 12-20-68, 7-4-69, Sept 27-69 - 6:30 by knife'.",
    culpritId: "suspect-arthur-allen",
    murderWeapon: "Custom 12-inch Bayonet & Precut Clothesline",
    actualMotive: "Pathological craving for public notoriety and psychological dominance over law enforcement.",
    keyContradiction: "Arthur Leigh Allen claimed he was scuba diving in Carmel on September 27, 1969, but gas station receipts and witnesses place his Corvair near Napa with bloody hunting knives in his trunk.",
    suspects: [
      {
        id: "suspect-arthur-allen",
        name: "Arthur Leigh Allen",
        role: "Former Schoolteacher & Chemist",
        age: 35,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        personality: "Childish, manipulative, wore a Zodiac brand watch with the exact crosshair symbol.",
        voiceTone: "Monotone, pedantic, evasive when questioned about firearms and diving.",
        publicAlibi: "I went diving down at Carmel all weekend and stayed at a coastal motel.",
        hiddenSecret: "He told his friend Don Cheney in 1968 that he would call himself 'Zodiac' and hunt humans.",
        isKiller: true,
        vulnerabilities: "Zodiac brand wristwatch, Royal typewriter matching cipher font, bloody knives in car trunk."
      },
      {
        id: "suspect-lawrence-kane",
        name: "Lawrence Kane",
        role: "Nightclub Manager & Tech",
        age: 45,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        personality: "Volatile, sustained severe brain injury affecting impulse control.",
        voiceTone: "Fast, nervous, sharp New York accent.",
        publicAlibi: "I was working at the Sahara Tahoe hotel.",
        hiddenSecret: "He stalked victim Darlene Ferrin at a Vallejo diner prior to her shooting.",
        isKiller: false,
        vulnerabilities: "Timesheet gaps, identification by Officer Fouke."
      },
      {
        id: "suspect-richard-gaikowski",
        name: "Richard Gaikowski",
        role: "Counterculture Newspaper Editor",
        age: 33,
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        personality: "Intellectual anti-war activist, obsessed with coded messages.",
        voiceTone: "Fast, energetic, argumentative.",
        publicAlibi: "I was editing articles in the San Francisco Good Times office.",
        hiddenSecret: "His newspaper published coded poems matching cipher patterns weeks before Zodiac letters arrived.",
        isKiller: false,
        vulnerabilities: "Voice recording matched by 911 dispatcher Nancy Slover."
      },
      {
        id: "suspect-ross-sullivan",
        name: "Ross Sullivan",
        role: "College Library Assistant",
        age: 28,
        avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
        personality: "Reclusive, 6ft 2in 250lbs, wore military fatigue jackets.",
        voiceTone: "Muffled, awkward, nervous.",
        publicAlibi: "I was in the college library stacks.",
        hiddenSecret: "He vanished for several days immediately after the 1966 Riverside murder.",
        isKiller: false,
        vulnerabilities: "Library checkout records, military footprint matching size 10.5 Wing Walker boots."
      },
      {
        id: "suspect-gary-poste",
        name: "Gary Francis Poste",
        role: "Air Force Veteran & House Painter",
        age: 41,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
        personality: "Military disciplinarian, survivalist leader.",
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
      description: "Isolated shoreline of Lake Berryessa under dusk sun.",
      hotspots: []
    }
  },

  // 4. 🏥 REAL INDIAN COLD CASE: The RG Kar Hospital Case (Kolkata, 2024)
  {
    id: "case-rg-kar-2024",
    title: "The RG Kar Hospital Investigation (Kolkata 2024)",
    subtitle: "The Seminar Hall Midnight Forensic & Timeline Investigation",
    difficulty: "Active Real Case (Forensics & CCTV)",
    estimatedTime: "Active Investigation",
    status: "CBI FORENSIC DOSSIER",
    victim: "31-Year-Old Post-Graduate Resident Doctor",
    victimRole: "Duty Resident Doctor (Department of Chest Medicine)",
    timeOfDeath: "August 9, 2024 (03:00 - 05:00 IST)",
    location: "3rd Floor Seminar Hall, Emergency Building, RG Kar Medical College, Kolkata",
    overview: "On August 9, 2024, a 31-year-old post-graduate resident doctor was found dead inside the 3rd-floor seminar room of the Emergency Building at RG Kar Medical College and Hospital, Kolkata, following a strenuous 36-hour duty shift. Central Bureau of Investigation (CBI) and forensic autopsies revealed manual strangulation, severe asphyxiation, and physical trauma. Crucial forensic evidence recovered at the crime scene included a paired Bluetooth earphone, CCTV timestamps showing unauthorized ingress by a civic volunteer, and suspicious hospital renovation orders issued immediately adjacent to the crime scene.",
    crimeDetails: "Manual strangulation and asphyxiation with deep facial abrasions. Foreign biological DNA recovered beneath the victim's fingernails and on the broken Bluetooth headset casing.",
    culpritId: "suspect-civic-volunteer",
    murderWeapon: "Manual Asphyxiation & Physical Restraint",
    actualMotive: "Violent midnight assault during unauthorized access to the unmonitored 3rd floor seminar room.",
    keyContradiction: "Civic volunteer Sanjay claimed he never visited the 3rd floor seminar room between 03:30 and 05:00, but high-definition CCTV logs confirm him entering the wing at 04:03 wearing a Bluetooth earphone around his neck, and exiting at 04:37 without the earphone. The identical device was recovered next to the victim's mattress.",
    suspects: [
      {
        id: "suspect-civic-volunteer",
        name: "Sanjay Roy",
        role: "Kolkata Police Civic Volunteer (Hospital Welfare Group)",
        age: 33,
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
        personality: "Aggressive, boasts of high-level police connections, unhindered access to all hospital wards.",
        voiceTone: "Defiant, evasive, shifts blame to hospital security.",
        publicAlibi: "I was drinking with friends at the 4th Battalion barrack in Shyambazar and only visited the casualty desk for 5 minutes.",
        hiddenSecret: "He routinely loitered in restricted hospital departments late at night using his civic volunteer badge to bypass checkpoints.",
        isKiller: true,
        vulnerabilities: "Bluetooth headset recovered at crime scene pairing with his personal smartphone, CCTV footage at 04:03 IST."
      },
      {
        id: "suspect-principal-sandip",
        name: "Dr. Sandip Ghosh",
        role: "Former Principal, RG Kar Medical College",
        age: 53,
        avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
        personality: "Authoritarian, influential administrative power, quick to dismiss institutional lapses.",
        voiceTone: "Bureaucratic, evasive, claims administrative protocols were followed.",
        publicAlibi: "I was at my residence in Beliaghata and was only informed by the medical superintendent at 09:30 AM.",
        hiddenSecret: "He ordered rapid PWD demolition of the rest area adjacent to the seminar room on August 10, sparking allegations of evidence tampering.",
        isKiller: false,
        vulnerabilities: "Urgent PWD renovation requisition order memo, call logs with local police station chiefs."
      },
      {
        id: "suspect-duty-rmo",
        name: "Dr. Arindam Ghosh",
        role: "Night Duty Resident Medical Officer (RMO)",
        age: 39,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
        personality: "Anxious, stressed, overwhelmed by hospital duty workload.",
        voiceTone: "Nervous, fast-paced, defensive about departmental supervision.",
        publicAlibi: "I was in the casualty observation ward managing incoming trauma patients continuously from 02:00 to 06:00.",
        hiddenSecret: "He knew the seminar room latch was broken and that unauthorized outsiders slept there, but never filed a security complaint.",
        isKiller: false,
        vulnerabilities: "Casualty patient triage log discrepancies, CCTV in hallway."
      },
      {
        id: "suspect-security-guard",
        name: "Tapas Mallick",
        role: "Emergency Wing Night Security Guard",
        age: 45,
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        personality: "Fatigued, easily intimidated by civic volunteers and police personnel.",
        voiceTone: "Submissive, apologetic, fearful of losing employment.",
        publicAlibi: "I was stationed at the ground floor emergency triage gate all night.",
        hiddenSecret: "He allowed civic volunteers to enter restricted staff areas without signing the visitor register in exchange for minor favors.",
        isKiller: false,
        vulnerabilities: "Blank security visitor logbook for August 8-9 night shift."
      },
      {
        id: "suspect-intern-colleague",
        name: "Dr. Aniket Das",
        role: "PG Trainee Colleague (Chest Medicine)",
        age: 29,
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
        personality: "Distraught, traumatized, outspoken advocate for resident safety.",
        voiceTone: "Emotional, angry, highly cooperative with investigators.",
        publicAlibi: "I had dinner with the victim at 02:00 in the seminar room and went to sleep in the male doctor's duty room at 02:45.",
        hiddenSecret: "He initially feared speaking out about institutional corruption in medicine procurement at the college.",
        isKiller: false,
        vulnerabilities: "CCTV confirmed entry into male duty room at 02:48."
      }
    ],
    clues: [
      {
        id: "clue-rgk-bluetooth",
        title: "Recovered TWS Bluetooth Headset",
        category: "physical",
        description: "A black Bluetooth earphone found lying near the wooden podium mattress in the 3rd floor seminar room. Device MAC address matched to Sanjay Roy's seized mobile phone.",
        significance: "Crucial physical evidence establishing direct presence of the civic volunteer at the exact murder spot.",
        nodeType: "evidence",
        discovered: true,
        x: 420,
        y: 160
      },
      {
        id: "clue-rgk-cctv-log",
        title: "Emergency 3rd Floor CCTV Log (04:03 IST)",
        category: "digital",
        description: "CCTV timestamp: 04:03 IST - Sanjay Roy observed walking into the 3rd floor seminar corridor with earphone. 04:37 IST - Sanjay exits the building briskly without earphone.",
        significance: "Irrefutable digital timeline establishing entry, duration, and departure.",
        nodeType: "evidence",
        discovered: true,
        x: 660,
        y: 220
      },
      {
        id: "clue-rgk-autopsy",
        title: "Central Forensic Autopsy Report #RGK-24",
        category: "forensic",
        description: "Death caused by manual strangulation and asphyxia between 03:00 and 05:00 IST. Deep nail scratch marks, defensive bruising, and epithelial DNA recovered under victim's fingernails.",
        significance: "Confirms violent struggle and pinpoint time of death matching the CCTV window.",
        nodeType: "evidence",
        discovered: true,
        x: 200,
        y: 300
      },
      {
        id: "clue-rgk-renovation-order",
        title: "PWD Urgent Demolition Order Memo #77",
        category: "digital",
        description: "Official requisition signed August 10 directing immediate demolition and renovation of the restroom adjacent to the crime scene seminar hall.",
        significance: "Raised immediate suspicion of institutional evidence destruction.",
        nodeType: "evidence",
        discovered: true,
        x: 440,
        y: 440
      },
      {
        id: "clue-rgk-duty-roster",
        title: "Emergency Chest Medicine Duty Roster",
        category: "testimonial",
        description: "Hospital shift roster confirming the victim was on an exhausting continuous 36-hour shift without access to a dedicated locked resting room.",
        significance: "Explains why the victim had to rest in the seminar hall.",
        nodeType: "evidence",
        discovered: true,
        x: 180,
        y: 180
      }
    ],
    defaultConnections: [
      { id: "conn-rgk-1", from: "suspect-civic-volunteer", to: "clue-rgk-bluetooth", label: "MAC Address Match" },
      { id: "conn-rgk-2", from: "suspect-civic-volunteer", to: "clue-rgk-cctv-log", label: "04:03 CCTV Timestamp" },
      { id: "conn-rgk-3", from: "suspect-principal-sandip", to: "clue-rgk-renovation-order", label: "Signed Renovation Memo" }
    ],
    osintData: {
      socialLeaks: [
        {
          id: "osint-rgk-1",
          target: "Kolkata Police & CBI Central Gazette",
          platform: "Press Information Bureau & Court Filings",
          timestamp: "2024-08-14 11:00 IST",
          snippet: "CBI chargesheet highlights forensic DNA profiling, Bluetooth earphone pairing, and 04:03 CCTV corridor telemetry.",
          threatLevel: "Critical",
          notes: "Official investigation record."
        }
      ],
      geoTraces: [
        {
          id: "geo-rgk-1",
          subject: "Sanjay Roy (Civic Volunteer)",
          device: "Mobile Tower CDR & Bluetooth Log",
          logs: [
            { time: "01:00", tower: "Shyambazar Outpost", status: "Active on cell network" },
            { time: "04:03", tower: "RG Kar Emergency Wing", status: "CCTV recorded entering 3rd floor" },
            { time: "04:37", tower: "RG Kar Main Gate", status: "CCTV recorded leaving campus" }
          ]
        }
      ],
      forensics: [
        {
          id: "forensic-rgk-1",
          title: "CFSL Central DNA Match Report",
          fileType: "Forensic Genetics File",
          preview: "Biological DNA recovered from victim's fingernails and the crime scene Bluetooth earphone exhibits a 99.99% match with sample #SR-01 (Sanjay Roy).",
          verified: true
        }
      ]
    },
    crimeScene: {
      backgroundImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80",
      description: "3rd Floor Seminar Hall of RG Kar Hospital Emergency Building. Dimly lit institutional hall, podium stage, scattered medical notebooks, unlatched entry door.",
      hotspots: [
        {
          id: "hotspot-seminar-podium",
          name: "Podium & Resting Area",
          x: 48,
          y: 62,
          radius: 35,
          clueId: "clue-rgk-bluetooth",
          discoveredText: "Beside the wooden stage lies the dropped Bluetooth earphone with visible scuff marks."
        }
      ]
    }
  },

  // 5. 🏠 REAL INDIAN COLD CASE: The Burari Deaths Mystery (Delhi, 2018)
  {
    id: "case-burari-2018",
    title: "The Burari Deaths Mystery (Delhi 2018)",
    subtitle: "The 11 Diarized Ritual Deaths in Sant Nagar",
    difficulty: "Real Cold Case (Psychological & Forensics)",
    estimatedTime: "Active Investigation",
    status: "CLOSED (SHARED PSYCHOSIS)",
    victim: "11 Members of the Chundawat Family",
    victimRole: "Family Members & Neighborhood Grocery Merchants",
    timeOfDeath: "June 30 - July 1, 2018 (00:00 - 02:00 IST)",
    location: "Sant Nagar, Burari, North Delhi",
    overview: "On the morning of July 1, 2018, 11 members of the Chundawat family were found deceased inside their residence in Burari, Delhi. Ten individuals were discovered suspended in a circular pattern beneath a ceiling iron mesh, while the matriarch lay in an adjacent bedroom. Eleven hand-written diaries spanning 11 years revealed instructions for an elaborate ritual ('Badh Tapasya'). The case remains one of India's most scrutinized psychological autopsies.",
    crimeDetails: "Asphyxiation by hanging following ritual binding. Zero struggle marks, no forced entry, no defensive trauma. High-potency psychological indoctrination.",
    culpritId: "suspect-lalit-chundawat",
    murderWeapon: "Ritual Cotton Ropes & Cloth Bindings",
    actualMotive: "Delusional belief in supernatural intervention and paternal resurrection via ritual Badh Tapasya.",
    keyContradiction: "The diaries detailed that the family would not die and that their deceased father would appear to save them, but physical forensic evidence confirmed irreversible ligature asphyxiation.",
    suspects: [
      {
        id: "suspect-lalit-chundawat",
        name: "Lalit Chundawat",
        role: "Family Head & Author of Occult Diaries",
        age: 45,
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
        personality: "Dominant, convinced of auditory visions of his deceased father Bhopal Singh.",
        voiceTone: "Authoritative, solemn, deeply religious.",
        publicAlibi: "Inside the home conducting family prayers.",
        hiddenSecret: "Suffered from untreated post-traumatic stress and induced shared delusional disorder (folie à deux/famille).",
        isKiller: true,
        vulnerabilities: "11 handwritten notebooks spanning 2007 to 2018 detailing exact death choreography."
      },
      {
        id: "suspect-occult-baba",
        name: "Tantrik Chandra Swami",
        role: "Local Occult Advisor",
        age: 50,
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        personality: "Greedy, charismatic, sells protective amulets to local merchants.",
        voiceTone: "Smooth, persuasive, claims spiritual mastery.",
        publicAlibi: "I was in Haridwar attending a religious gathering on July 1.",
        hiddenSecret: "Sold ritual vermilion and copper amulets to Lalit weeks before the incident.",
        isKiller: false,
        vulnerabilities: "Bank transfer slips from Lalit's grocery account."
      },
      {
        id: "suspect-builder-gurucharan",
        name: "Gurucharan Singh",
        role: "Burari House Contractor & Pipe Installer",
        age: 48,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
        personality: "Blunt, practical, bewildered by media conspiracy theories.",
        voiceTone: "Gruff, straightforward contractor.",
        publicAlibi: "I was at my shop in Sant Nagar.",
        hiddenSecret: "Installed 11 plastic water pipes protruding from the house wall matching family counts, creating public hysteria.",
        isKiller: false,
        vulnerabilities: "Construction invoice and plumbing layout schematics."
      },
      {
        id: "suspect-neighbor-kuldeep",
        name: "Kuldeep Sharma",
        role: "Next-Door Neighbor & First Discoverer",
        age: 38,
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
        personality: "Shocked, highly visible in news media interviews.",
        voiceTone: "Trembling, distraught.",
        publicAlibi: "Walked over to buy milk at 07:15 AM when he found the door open.",
        hiddenSecret: "Owed Rs. 50,000 credit at the Chundawat plywood shop.",
        isKiller: false,
        vulnerabilities: "Plywood ledger notes."
      },
      {
        id: "suspect-psychiatrist-verma",
        name: "Dr. R. K. Verma",
        role: "CBI Forensic Psychological Autopsy Consultant",
        age: 56,
        avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
        personality: "Scientific, objective, specializes in collective behavioral disorders.",
        voiceTone: "Calm, clinical, analytical.",
        publicAlibi: "Consulting with Delhi Police Crime Branch.",
        hiddenSecret: "Authored the definitive CBI Psychological Autopsy Report establishing shared delusional disorder.",
        isKiller: false,
        vulnerabilities: "Official CBI forensic psychiatric file."
      }
    ],
    clues: [
      {
        id: "clue-burari-diaries",
        title: "11 Handwritten Ritual Diaries (2007-2018)",
        category: "physical",
        description: "Recovered from the prayer altar. Exactly describes the 'Badh Tapasya' (Banyan Tree ritual), detailing how family members must blindfold, gag, and tie their limbs.",
        significance: "Conclusive physical evidence of non-homicidal shared delusional ritual.",
        nodeType: "evidence",
        discovered: true,
        x: 400,
        y: 180
      },
      {
        id: "clue-burari-cctv",
        title: "Sant Nagar Lane CCTV Footage (June 30, 22:30 IST)",
        category: "digital",
        description: "Shows family members carrying new stools and wires into the house voluntarily at 22:30. Zero external persons entered the premises overnight.",
        significance: "Rules out third-party home invasion.",
        nodeType: "evidence",
        discovered: true,
        x: 650,
        y: 260
      },
      {
        id: "clue-burari-autopsy",
        title: "Delhi Police Forensic Autopsy Report",
        category: "forensic",
        description: "All 11 victims died of ante-mortem hanging. Toxicology revealed zero poison, sedatives, or chemical incapacitation in food or viscera.",
        significance: "Proves voluntary compliance during the ritual without sedation.",
        nodeType: "evidence",
        discovered: true,
        x: 220,
        y: 320
      }
    ],
    defaultConnections: [
      { id: "conn-bur-1", from: "suspect-lalit-chundawat", to: "clue-burari-diaries", label: "Handwriting Match" },
      { id: "conn-bur-2", from: "clue-burari-cctv", to: "clue-burari-autopsy", label: "Voluntary Ingress" }
    ],
    osintData: {
      socialLeaks: [],
      geoTraces: [],
      forensics: []
    },
    crimeScene: {
      backgroundImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
      description: "Sant Nagar two-story residence. Prayer room with brass bells, wooden stool array beneath central ceiling grill.",
      hotspots: []
    }
  }
];

