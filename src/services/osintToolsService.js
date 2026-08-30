// Real OSINT & Intelligence Tools for Indian & Global Phone Numbers, Handles, and Public Records
// Created for Detective-L by Rakesh Soni

/**
 * Indian Telecom Circles mapping according to DoT (Department of Telecommunications) & TRAI
 */
const INDIAN_TELECOM_CIRCLES = {
  // Northern
  'DL': 'Delhi NCR',
  'HR': 'Haryana',
  'PB': 'Punjab',
  'HP': 'Himachal Pradesh',
  'JK': 'Jammu & Kashmir',
  'UPW': 'Uttar Pradesh (West) & Uttarakhand',
  'UPE': 'Uttar Pradesh (East)',
  'RJ': 'Rajasthan',
  // Western
  'MH': 'Maharashtra & Goa',
  'MB': 'Mumbai Metro',
  'GJ': 'Gujarat',
  'MP': 'Madhya Pradesh & Chhattisgarh',
  // Southern
  'AP': 'Andhra Pradesh & Telangana',
  'KA': 'Karnataka (Bangalore)',
  'TN': 'Tamil Nadu & Pondicherry',
  'CH': 'Chennai Metro',
  'KL': 'Kerala & Lakshadweep',
  // Eastern
  'WB': 'West Bengal & Sikkim',
  'KO': 'Kolkata Metro',
  'OR': 'Odisha',
  'BH': 'Bihar & Jharkhand',
  'NE': 'North East (Arunachal, Meghalaya, Manipur, Mizoram, Nagaland, Tripura)',
  'AS': 'Assam'
};

/**
 * Common Indian Mobile Series Prefix Mapping (MSC Code Sample Registry)
 */
const INDIAN_OPERATOR_PREFIXES = {
  // Jio (Series 6, 7, 8, 9)
  '700': { operator: 'Reliance Jio Infocomm', circle: 'National 4G/5G' },
  '701': { operator: 'Reliance Jio Infocomm', circle: 'National 4G/5G' },
  '702': { operator: 'Reliance Jio Infocomm', circle: 'National 4G/5G' },
  '703': { operator: 'Reliance Jio Infocomm', circle: 'National 4G/5G' },
  '704': { operator: 'Reliance Jio Infocomm', circle: 'National 4G/5G' },
  '705': { operator: 'Reliance Jio Infocomm', circle: 'National 4G/5G' },
  '706': { operator: 'Reliance Jio Infocomm', circle: 'National 4G/5G' },
  '707': { operator: 'Reliance Jio Infocomm', circle: 'National 4G/5G' },
  '708': { operator: 'Reliance Jio Infocomm', circle: 'National 4G/5G' },
  '709': { operator: 'Reliance Jio Infocomm', circle: 'National 4G/5G' },
  '620': { operator: 'Reliance Jio Infocomm', circle: 'BH' },
  '626': { operator: 'Reliance Jio Infocomm', circle: 'MP' },
  '628': { operator: 'Reliance Jio Infocomm', circle: 'PB' },
  '629': { operator: 'Reliance Jio Infocomm', circle: 'KO' },
  '630': { operator: 'Reliance Jio Infocomm', circle: 'AP' },
  '635': { operator: 'Reliance Jio Infocomm', circle: 'GJ' },
  '636': { operator: 'Reliance Jio Infocomm', circle: 'KA' },
  '637': { operator: 'Reliance Jio Infocomm', circle: 'OR' },
  '638': { operator: 'Reliance Jio Infocomm', circle: 'TN' },
  '639': { operator: 'Reliance Jio Infocomm', circle: 'UPE' },

  // Airtel
  '9810': { operator: 'Bharti Airtel', circle: 'DL' },
  '9811': { operator: 'Bharti Airtel / Vodafone', circle: 'DL' },
  '9820': { operator: 'Bharti Airtel / Vodafone', circle: 'MB' },
  '9821': { operator: 'Bharti Airtel / Vodafone', circle: 'MB' },
  '9845': { operator: 'Bharti Airtel', circle: 'KA' },
  '9844': { operator: 'Bharti Airtel', circle: 'KA' },
  '9830': { operator: 'Bharti Airtel', circle: 'KO' },
  '9831': { operator: 'Bharti Airtel / Vodafone', circle: 'KO' },
  '9840': { operator: 'Bharti Airtel', circle: 'CH' },
  '9841': { operator: 'Bharti Airtel / Vodafone', circle: 'CH' },
  '9890': { operator: 'Bharti Airtel', circle: 'MH' },
  '9822': { operator: 'Bharti Airtel / Vodafone', circle: 'MH' },
  '9825': { operator: 'Bharti Airtel / Vodafone', circle: 'GJ' },
  '9829': { operator: 'Bharti Airtel', circle: 'RJ' },
  '9896': { operator: 'Bharti Airtel', circle: 'HR' },
  '9814': { operator: 'Bharti Airtel', circle: 'PB' },
  '9816': { operator: 'Bharti Airtel', circle: 'HP' },
  '9855': { operator: 'Bharti Airtel', circle: 'PB' },
  '9866': { operator: 'Bharti Airtel', circle: 'AP' },
  '9871': { operator: 'Bharti Airtel', circle: 'DL' },
  '9872': { operator: 'Bharti Airtel', circle: 'PB' },
  '9873': { operator: 'Bharti Airtel', circle: 'DL' },
  '9900': { operator: 'Bharti Airtel', circle: 'KA' },
  '9910': { operator: 'Bharti Airtel', circle: 'DL' },
  '9920': { operator: 'Bharti Airtel / Vodafone', circle: 'MB' },

  // Vodafone Idea (VI)
  '9892': { operator: 'Vodafone Idea (VI)', circle: 'MB' },
  '9891': { operator: 'Vodafone Idea (VI)', circle: 'DL' },
  '9823': { operator: 'Vodafone Idea (VI)', circle: 'MH' },
  '9846': { operator: 'Vodafone Idea (VI)', circle: 'KL' },
  '9824': { operator: 'Vodafone Idea (VI)', circle: 'GJ' },
  '9886': { operator: 'Vodafone Idea (VI)', circle: 'KA' },
  '9899': { operator: 'Vodafone Idea (VI)', circle: 'DL' },

  // BSNL / MTNL
  '9415': { operator: 'BSNL Mobile', circle: 'UPE' },
  '9412': { operator: 'BSNL Mobile', circle: 'UPW' },
  '9414': { operator: 'BSNL Mobile', circle: 'RJ' },
  '9419': { operator: 'BSNL Mobile', circle: 'JK' },
  '9422': { operator: 'BSNL Mobile', circle: 'MH' },
  '9425': { operator: 'BSNL Mobile', circle: 'MP' },
  '9431': { operator: 'BSNL Mobile', circle: 'BH' },
  '9433': { operator: 'BSNL Mobile', circle: 'KO' },
  '9435': { operator: 'BSNL Mobile', circle: 'AS' },
  '9440': { operator: 'BSNL Mobile', circle: 'AP' },
  '9443': { operator: 'BSNL Mobile', circle: 'TN' },
  '9447': { operator: 'BSNL Mobile', circle: 'KL' },
  '9448': { operator: 'BSNL Mobile', circle: 'KA' },
};

/**
 * Analyze an Indian or International phone number using public Telecom OSINT
 */
export function analyzePhoneNumber(rawInput) {
  if (!rawInput) return null;
  
  // Clean non-digits except +
  let cleaned = rawInput.replace(/[^\d+]/g, '');
  let isIndian = false;
  let nationalNumber = '';

  if (cleaned.startsWith('+91')) {
    isIndian = true;
    nationalNumber = cleaned.substring(3);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    isIndian = true;
    nationalNumber = cleaned.substring(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    isIndian = true;
    nationalNumber = cleaned.substring(1);
  } else if (cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned)) {
    isIndian = true;
    nationalNumber = cleaned;
  } else {
    nationalNumber = cleaned.replace(/^\+/, '');
  }

  if (isIndian && nationalNumber.length === 10) {
    const prefix4 = nationalNumber.substring(0, 4);
    const prefix3 = nationalNumber.substring(0, 3);
    const prefix2 = nationalNumber.substring(0, 2);

    let match = INDIAN_OPERATOR_PREFIXES[prefix4] || INDIAN_OPERATOR_PREFIXES[prefix3];

    let operatorName = match ? match.operator : 'Indian Cellular Network (Airtel / Jio / VI / BSNL)';
    let circleCode = match ? match.circle : 'National All-India Roaming';
    let circleName = INDIAN_TELECOM_CIRCLES[circleCode] || circleCode;

    if (!match) {
      if (prefix2.startsWith('6') || prefix2.startsWith('7')) {
        operatorName = 'Reliance Jio / Bharti Airtel (4G/5G New Series)';
      } else if (prefix2.startsWith('8')) {
        operatorName = 'Bharti Airtel / Vodafone Idea (VI)';
      } else if (prefix2.startsWith('9')) {
        operatorName = 'Airtel / Vodafone Idea / BSNL (Legacy Tier-1 Series)';
      }
    }

    const internationalFormat = `+91 ${nationalNumber.substring(0, 5)} ${nationalNumber.substring(5)}`;
    const e164 = `+91${nationalNumber}`;

    return {
      isValid: true,
      country: 'India (IN)',
      countryCode: '+91',
      nationalNumber: nationalNumber,
      internationalFormat: internationalFormat,
      e164: e164,
      operator: operatorName,
      telecomCircle: circleName,
      circleCode: circleCode,
      lineType: 'Mobile (GSM / VoLTE / 5G SA)',
      possibleUPIVPAs: [
        `${nationalNumber}@paytm`,
        `${nationalNumber}@ybl (PhonePe)`,
        `${nationalNumber}@okhdfcbank (Google Pay)`,
        `${nationalNumber}@axl (Google Pay)`,
        `${nationalNumber}@apl (Amazon Pay)`
      ],
      whatsappDirectLink: `https://wa.me/91${nationalNumber}`,
      telegramSearchQuery: `https://t.me/+91${nationalNumber}`,
      truecallerSearchUrl: `https://www.truecaller.com/search/in/${nationalNumber}`,
      googleDorkQueries: [
        `"${nationalNumber}" OR "+91${nationalNumber}" filetype:pdf`,
        `"${nationalNumber}" site:facebook.com OR site:instagram.com OR site:linkedin.com`,
        `"${nationalNumber}" filetype:xls OR filetype:xlsx OR filetype:csv`,
        `"${nationalNumber}" site:gov.in OR site:nic.in`,
        `"${nationalNumber}" "FIR" OR "Police" OR "Court" OR "Order"`
      ]
    };
  }

  // Global fallback
  return {
    isValid: nationalNumber.length >= 7,
    country: 'International / Non-India',
    countryCode: cleaned.startsWith('+') ? cleaned.substring(0, 3) : 'Unknown',
    nationalNumber: nationalNumber,
    internationalFormat: cleaned.startsWith('+') ? cleaned : `+${cleaned}`,
    e164: cleaned.startsWith('+') ? cleaned : `+${cleaned}`,
    operator: 'International Telecom Carrier',
    telecomCircle: 'International Gateway',
    lineType: 'Mobile / Landline / VoIP',
    possibleUPIVPAs: [],
    whatsappDirectLink: `https://wa.me/${nationalNumber}`,
    telegramSearchQuery: `https://t.me/+${nationalNumber}`,
    truecallerSearchUrl: `https://www.truecaller.com/search/global/${nationalNumber}`,
    googleDorkQueries: [
      `"${nationalNumber}" filetype:pdf`,
      `"${nationalNumber}" site:linkedin.com OR site:twitter.com`,
      `"${nationalNumber}" "leak" OR "contact" OR "resume"`
    ]
  };
}

/**
 * Top OSINT Username Scanner across major platforms
 */
export const POPULAR_OSINT_PLATFORMS = [
  { name: 'GitHub', url: 'https://github.com/{username}', icon: 'github' },
  { name: 'Twitter / X', url: 'https://x.com/{username}', icon: 'twitter' },
  { name: 'Instagram', url: 'https://instagram.com/{username}', icon: 'instagram' },
  { name: 'Reddit', url: 'https://reddit.com/user/{username}', icon: 'reddit' },
  { name: 'Telegram', url: 'https://t.me/{username}', icon: 'telegram' },
  { name: 'LinkedIn', url: 'https://www.google.com/search?q=site:linkedin.com/in/{username}', icon: 'linkedin' },
  { name: 'Pinterest', url: 'https://pinterest.com/{username}', icon: 'pinterest' },
  { name: 'Medium', url: 'https://medium.com/@{username}', icon: 'medium' },
  { name: 'YouTube', url: 'https://youtube.com/@{username}', icon: 'youtube' },
  { name: 'Keybase', url: 'https://keybase.io/{username}', icon: 'keybase' },
  { name: 'HackerNews', url: 'https://news.ycombinator.com/user?id={username}', icon: 'hackernews' }
];

/**
 * Generate Real Google Dorks for Legal, FIR, and Case Research
 */
export function generateCaseDorks(caseTitle, victimName, location) {
  const queryWords = [caseTitle, victimName, location].filter(Boolean).map(w => `"${w}"`).join(' ');
  return [
    {
      title: 'Indian Courts & High Court Judgments (eCourts / Kanoon)',
      query: `site:indiankanoon.org OR site:sci.gov.in OR site:districts.ecourts.gov.in ${queryWords}`,
      description: 'Search official state High Courts, District Courts, and Supreme Court records.'
    },
    {
      title: 'State Police FIRs & Official Gazettes',
      query: `site:gov.in OR site:nic.in "FIR" OR "Charge Sheet" ${queryWords}`,
      description: 'Find official police department FIR uploads, notices, and wanted gazettes.'
    },
    {
      title: 'News Archives & Crime Investigative Reports',
      query: `site:thehindu.com OR site:timesofindia.indiatimes.com OR site:ndtv.com OR site:indianexpress.com "murder" OR "unsolved" ${queryWords}`,
      description: 'Cross-reference verified newspaper timelines from day of incident.'
    },
    {
      title: 'Leaked Documents & Investigation Briefs (PDF / XLSX)',
      query: `filetype:pdf OR filetype:doc "investigation" OR "forensic report" ${queryWords}`,
      description: 'Locate public or leaked forensic case analyses and academic criminology papers.'
    },
    {
      title: 'Wayback Machine & Deleted Digital Evidence',
      query: `https://web.archive.org/web/*/${queryWords.replace(/"/g, '')}`,
      description: 'Search snapshots of deleted blogs, social profiles, and articles.'
    }
  ];
}
