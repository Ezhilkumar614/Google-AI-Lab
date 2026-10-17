import { AnalysisResult } from '../types';

export interface DilemmaTemplate {
  id: string;
  badge: string;
  title: string;
  category: string;
  context: string;
  urgency: 'low' | 'medium' | 'high';
  reversible: 'type1_irreversible' | 'type2_reversible';
  options: { id: string; name: string; description: string }[];
  prebuiltAnalysis: AnalysisResult;
}

export const SAMPLE_STARTUP_ANALYSIS: AnalysisResult = {
  id: 'career_startup_vs_corp',
  decisionInput: {
    id: 'dec_sample_1',
    title: 'Series B AI Startup VP vs Stable FAANG Principal Lead',
    category: 'Career',
    context: 'Current role is comfortable with great $320k total comp, but feeling stagnated. The startup offers 1.2% equity, fast promotion velocity, but requires 55hr weeks and runway is 22 months.',
    urgency: 'high',
    reversible: 'type2_reversible',
    options: [
      { id: 'opt_1', name: 'Join Series B AI Startup', description: 'Head of Product with equity upside and fast pace' },
      { id: 'opt_2', name: 'Stay at Enterprise FAANG', description: 'Principal role, stable salary, predictable 40-hr weeks' },
    ],
    createdAt: Date.now() - 3600000,
  },
  timestamp: Date.now() - 3600000,
  summary: 'A classic tension between asymmetrical career trajectory upside versus blue-chip stability, predictability, and emotional peace of mind.',
  options: [
    {
      id: 'opt_1',
      name: 'Join Series B AI Startup',
      tagline: 'High-octane growth engine with asymmetric financial and leadership upside',
      pros: [
        {
          id: 'p1_1',
          text: 'Exponential Career Acceleration & Executive Visibility',
          explanation: 'Leading product at Series B gives direct C-suite impact and builds an executive resume in 18 months that takes 6 years in corporate.',
          category: 'Career',
          weight: 9,
        },
        {
          id: 'p1_2',
          text: 'Asymmetric Financial Upside via Equity',
          explanation: '1.2% equity in a high-performing AI company represents life-changing wealth potential if successful.',
          category: 'Financial',
          weight: 8,
        },
        {
          id: 'p1_3',
          text: 'Autonomy & High Execution Speed',
          explanation: 'Zero bureaucracy, rapid decision loops, and shipping directly to real customers weekly.',
          category: 'Growth',
          weight: 9,
        },
        {
          id: 'p1_4',
          text: 'Frontier AI Domain Expertise',
          explanation: 'Being immersed in real-world agentic AI infrastructure future-proofs technical leadership for the next decade.',
          category: 'Strategic',
          weight: 8,
        },
      ],
      cons: [
        {
          id: 'c1_1',
          text: 'Runway & Macro Capital Market Vulnerability',
          explanation: '22 months of runway leaves little room for failed product-market pivots before next funding squeeze.',
          category: 'Risk',
          weight: 8,
        },
        {
          id: 'c1_2',
          text: 'Work-Life Strain & 55+ Hour Workweeks',
          explanation: 'Demanding founders and aggressive release schedules can drain personal energy and family margins.',
          category: 'Lifestyle',
          weight: 7,
        },
        {
          id: 'c1_3',
          text: 'Reduced Cash Compensation Floor',
          explanation: 'Base cash will likely be 20-30% lower than FAANG liquid RSUs with higher tax volatility.',
          category: 'Financial',
          weight: 6,
        },
      ],
      swot: {
        strengths: [
          'High agility and zero organizational debt',
          'Equity upside aligned with personal performance',
          'Direct ownership of customer relationship and product vision',
        ],
        weaknesses: [
          'Limited HR and operational support infrastructure',
          'Higher day-to-day emotional roller coaster',
          'Dependence on venture capital funding conditions',
        ],
        opportunities: [
          'Establish industry reputation as leading AI product executive',
          'Potential liquidity event or future Series C valuation markup',
          'Network creation with elite early-stage founders and VCs',
        ],
        threats: [
          'Incumbents copying feature set before distribution scales',
          'Founder-executive misalignment on roadmap priorities',
          'Burnout during protracted market launch cycles',
        ],
      },
    },
    {
      id: 'opt_2',
      name: 'Stay at Enterprise FAANG',
      tagline: 'Fortified fortress of liquid compensation, prestige, and work-life balance',
      pros: [
        {
          id: 'p2_1',
          text: 'Guaranteed Liquid Cash Flow & Robust Benefits',
          explanation: 'Predictable vesting schedule and elite healthcare protect family finances during uncertain macroeconomic conditions.',
          category: 'Financial',
          weight: 8,
        },
        {
          id: 'p2_2',
          text: 'Sustainable 40-Hour Rhythm & Personal Sanity',
          explanation: 'Strict boundary separation between personal life and work, allowing hobby pursuits and mental rejuvenation.',
          category: 'Lifestyle',
          weight: 9,
        },
        {
          id: 'p2_3',
          text: 'Global Scale Impact & Massive Resources',
          explanation: 'Ability to ship systems touching tens of millions of active users backed by dedicated teams.',
          category: 'Strategic',
          weight: 7,
        },
      ],
      cons: [
        {
          id: 'c2_1',
          text: 'Intellectual Stagnation & Committee-Driven Politics',
          explanation: 'Slow multi-tier approval cycles and corporate maneuvering erode creative passion over time.',
          category: 'Growth',
          weight: 9,
        },
        {
          id: 'c2_2',
          text: 'Compounded Career Regret',
          explanation: 'Staying in the comfort zone during the peak AI inflection window carries severe opportunity cost.',
          category: 'Emotional',
          weight: 8,
        },
        {
          id: 'c2_3',
          text: 'Vulnerability to Silent Reorganizations',
          explanation: 'Corporate restructurings can suddenly reassign or defund beloved product lines.',
          category: 'Risk',
          weight: 6,
        },
      ],
      swot: {
        strengths: [
          'Tremendous balance sheet and resilient market position',
          'Established prestige and golden corporate pedigree',
          'Low individual downside risk in quarterly downswings',
        ],
        weaknesses: [
          'Sluggish innovation velocity due to consensus culture',
          'Limited individual leverage over macro company success',
          'Fragmented ownership and heavy internal compliance overhead',
        ],
        opportunities: [
          'Internal mobility to high-priority generative AI divisions',
          'Mentorship of junior staff and institutional thought leadership',
          'Accumulation of safe capital reserves for angel investing',
        ],
        threats: [
          'Risk of becoming pigeonholed in enterprise maintenance architectures',
          'Disruption of legacy business units by agile AI native competitors',
          'Loss of edge and execution sharpness against the market',
        ],
      },
    },
  ],
  comparisonMatrix: {
    criteria: [
      {
        name: 'Career Trajectory & Velocity',
        category: 'Career',
        importance: 'Critical',
        winnerOptionId: 'opt_1',
        scores: {
          opt_1: { rating: 9, rationale: 'Exponential leadership jump; proves executive capability.' },
          opt_2: { rating: 5, rationale: 'Incremental promotions require political navigation.' },
        },
      },
      {
        name: 'Financial Asymmetry (Upside vs Risk)',
        category: 'Financial',
        importance: 'High',
        winnerOptionId: 'opt_1',
        scores: {
          opt_1: { rating: 8, rationale: 'Equity can yield 5x-20x returns despite lower base.' },
          opt_2: { rating: 7, rationale: 'High cash certainty, but ceiling is strictly capped.' },
        },
      },
      {
        name: 'Work-Life Harmony & Stress Level',
        category: 'Lifestyle',
        importance: 'High',
        winnerOptionId: 'opt_2',
        scores: {
          opt_1: { rating: 4, rationale: 'Requires 55+ hrs/week with intense sprint pressure.' },
          opt_2: { rating: 9, rationale: 'Predictable 40 hrs with generous PTO and stability.' },
        },
      },
      {
        name: 'Learning Curve & Skill Future-Proofing',
        category: 'Growth',
        importance: 'Critical',
        winnerOptionId: 'opt_1',
        scores: {
          opt_1: { rating: 10, rationale: 'Direct frontier AI building and zero legacy drag.' },
          opt_2: { rating: 5, rationale: 'Stuck maintaining mature legacy systems.' },
        },
      },
      {
        name: 'Reversibility & Fallback Safety',
        category: 'Risk',
        importance: 'Medium',
        winnerOptionId: 'opt_1',
        scores: {
          opt_1: { rating: 8, rationale: 'FAANG alum who tries startup can return to FAANG anytime.' },
          opt_2: { rating: 6, rationale: 'Harder to jump into high-equity startup roles later in life.' },
        },
      },
    ],
  },
  verdict: {
    recommendedOptionId: 'opt_1',
    recommendedOptionName: 'Join Series B AI Startup',
    confidencePercentage: 84,
    headline: 'Leap Forward: This is a Type-2 Reversible Bet with Asymmetric Career Leverage',
    executiveRationale: 'Staying in the corporate comfort zone feels safe, but stagnation during the most consequential tech paradigm shift of our decade is a hidden high-cost gamble. Because you already hold FAANG pedigree, you possess an unbreakable safety net: if the startup underperforms in 18 months, big tech recruiters will welcome back a leader with battle-tested Series B executive grit.',
    theTiebreakerFactor: 'Jeff Bezos Regret Minimization Framework: At age 75, you will never regret spending 2 years sprinting at an ambitious AI startup, but you will profoundly regret wondering "what if" while sitting in quarterly corporate status meetings.',
    rule101010: {
      in10Minutes: 'You will feel a surge of nervous excitement and relief that the agony of indecision has finally ended.',
      in10Months: 'You will be working harder than before, but exhilarated by direct influence and rapid shipping milestones.',
      in10Years: 'Whether the company IPOs or gets acqui-hired, having led an AI company through Series B will be the crown jewel of your professional network.',
    },
    devilsAdvocate: {
      blindspot: 'Underestimating the emotional tax of early-stage chaos and lack of administrative guardrails.',
      harshTruth: 'You will have days where you miss having 10 internal teams handling devops, HR, and design polish for you.',
      howToMitigate: 'Pre-negotiate a protected weekend protocol, hire an exceptional chief of staff or senior IC right away, and set a hard 18-month equity re-evaluation milestone.',
    },
    testDriveExperiment: {
      title: 'The 48-Hour Deep Dive & Product Shadow',
      description: 'Spend an entire Friday in the startup office working alongside the founders on their roadmap, followed by dinner with their lead engineer without the CEO present.',
      duration: '48 Hours',
    },
  },
};

export const SAMPLE_HOUSING_ANALYSIS: AnalysisResult = {
  id: 'living_city_vs_suburb',
  decisionInput: {
    id: 'dec_sample_2',
    title: 'Buy 4-Bed House in Suburbs vs Rent Downtown Penthouse',
    category: 'Lifestyle',
    context: 'First child is 18 months old. Partner works hybrid 2 days/week. Downtown gives walkable culture and zero commute, suburbs offer huge yard, top public school ratings, and equity accumulation.',
    urgency: 'medium',
    reversible: 'type1_irreversible',
    options: [
      { id: 'opt_1', name: 'Buy House in Suburbs', description: 'Spacious yard, top schools, 45-min train commute' },
      { id: 'opt_2', name: 'Continue Renting Downtown', description: 'Walkable lifestyle, vibrant culture, smaller space' },
    ],
    createdAt: Date.now() - 7200000,
  },
  timestamp: Date.now() - 7200000,
  summary: 'Evaluating long-term family infrastructure and equity building against urban mobility, cultural vibrancy, and commute preservation.',
  options: [
    {
      id: 'opt_1',
      name: 'Buy House in Suburbs',
      tagline: 'High square footage, dedicated yard, and permanent family stability',
      pros: [
        {
          id: 'p_h1',
          text: 'Top Tier Public School District Access',
          explanation: 'Saves an estimated $30k/year in private school tuition once your child enters kindergarten.',
          category: 'Financial',
          weight: 9,
        },
        {
          id: 'p_h2',
          text: 'Dedicated Yard & Physical Play Space',
          explanation: 'Critical quality-of-life upgrade for a growing toddler and family social gatherings.',
          category: 'Lifestyle',
          weight: 8,
        },
        {
          id: 'p_h3',
          text: 'Forced Savings & Long-term Home Equity',
          explanation: 'Mortgage amortization builds generational equity instead of permanent landlord rent transfer.',
          category: 'Financial',
          weight: 8,
        },
      ],
      cons: [
        {
          id: 'c_h1',
          text: '45-Minute Daily Commute Tax',
          explanation: 'Losing 1.5 hours roundtrip on hybrid commute days drains daily personal and workout time.',
          category: 'Lifestyle',
          weight: 8,
        },
        {
          id: 'c_h2',
          text: 'Maintenance & Hidden Ownership Overhead',
          explanation: 'Property taxes, roof maintenance, lawn care, and unexpected repairs cost 1-2% of home value annually.',
          category: 'Financial',
          weight: 7,
        },
      ],
      swot: {
        strengths: ['Predictable housing stability', 'Spacious nursery and home offices', 'Strong neighborhood community'],
        weaknesses: ['High transaction friction (6% broker fees)', 'Automobile dependency for all basic errands'],
        opportunities: ['Long-term real estate appreciation', 'Refinancing when interest rates decline'],
        threats: ['Local property tax reassessments', 'Commute fatigue during bad weather seasons'],
      },
    },
    {
      id: 'opt_2',
      name: 'Continue Renting Downtown',
      tagline: 'Walkable urban convenience, maximum agility, and zero maintenance friction',
      pros: [
        {
          id: 'p_h2_1',
          text: 'Zero Commute & Walk-Everywhere Lifestyle',
          explanation: 'Walk to work, restaurants, parks, and daycare with zero time lost in traffic gridlock.',
          category: 'Lifestyle',
          weight: 9,
        },
        {
          id: 'p_h2_2',
          text: 'Capital Liquidity & Investment Freedom',
          explanation: 'Keep down payment capital compounding in diversified index funds without illiquid real estate lockup.',
          category: 'Financial',
          weight: 8,
        },
        {
          id: 'p_h2_3',
          text: 'Zero Landlord / Maintenance Responsibilities',
          explanation: 'Any plumbing or appliance issues are resolved with one maintenance ticket, zero surprise bills.',
          category: 'Personal',
          weight: 7,
        },
      ],
      cons: [
        {
          id: 'c_h2_1',
          text: 'Toddler Space Constraint Friction',
          explanation: 'Strollers, toys, and nursery equipment crowd urban apartments quickly as kids grow.',
          category: 'Lifestyle',
          weight: 8,
        },
        {
          id: 'c_h2_2',
          text: 'Annual Rent Escalation Risk',
          explanation: 'Landlords can raise rent 5-10% annually or choose not to renew the lease unexpectedly.',
          category: 'Risk',
          weight: 7,
        },
      ],
      swot: {
        strengths: ['Ultimate lifestyle flexibility', 'Maximum free hours per day due to zero commute'],
        weaknesses: ['Zero equity accumulation from monthly rent', 'Space limitations for expanding families'],
        opportunities: ['Ability to relocate or take global career promotions on 30 days notice'],
        threats: ['Downtown noise pollution affecting toddler sleep routines'],
      },
    },
  ],
  comparisonMatrix: {
    criteria: [
      {
        name: 'Family Growth & Spatial Comfort',
        category: 'Lifestyle',
        importance: 'Critical',
        winnerOptionId: 'opt_1',
        scores: {
          opt_1: { rating: 10, rationale: 'Four bedrooms, basement, and dedicated private yard.' },
          opt_2: { rating: 5, rationale: 'Compact square footage with shared elevators and noise.' },
        },
      },
      {
        name: 'Time Wealth & Daily Commute',
        category: 'Lifestyle',
        importance: 'Critical',
        winnerOptionId: 'opt_2',
        scores: {
          opt_1: { rating: 5, rationale: '90 minutes lost per hybrid work day.' },
          opt_2: { rating: 10, rationale: 'Walk to office and daycare in under 10 minutes.' },
        },
      },
      {
        name: 'Net Wealth Acceleration',
        category: 'Financial',
        importance: 'High',
        winnerOptionId: 'opt_1',
        scores: {
          opt_1: { rating: 8, rationale: 'Mortgage paydown acts as automated forced savings.' },
          opt_2: { rating: 7, rationale: 'Requires strict discipline to invest surplus capital into index funds.' },
        },
      },
    ],
  },
  verdict: {
    recommendedOptionId: 'opt_1',
    recommendedOptionName: 'Buy House in Suburbs',
    confidencePercentage: 76,
    headline: 'Invest in the Suburb Home: The Toddler-to-Kindergarten Window Demands Space',
    executiveRationale: 'While the downtown commute is unbeatable, children under 5 fundamentally reshape how hours outside of work are spent. The lack of private outdoor space and encroaching clutter will produce daily micro-friction. Since your partner is hybrid only 2 days a week, the commute penalty is contained to just 4 days a month combined.',
    theTiebreakerFactor: 'The Toddler Outdoor Multiplier: An accessible private backyard provides 400+ hours of spontaneous active play each year that apartment living simply cannot replicate.',
    rule101010: {
      in10Minutes: 'You will feel anxious about the mortgage paperwork and closing escrow costs.',
      in10Months: 'Your child will be running across the grass while you work comfortably in a quiet dedicated home office.',
      in10Years: 'You will have 10 years of accumulated home equity and seamless enrollment in top public schools.',
    },
    devilsAdvocate: {
      blindspot: 'Ignoring the psychological toll of train delays on long rainy workdays.',
      harshTruth: 'You will socialise downtown 70% less often than you currently think you will.',
      howToMitigate: 'Treat commute transit time as sacred audio reading/podcast time; budget $200/month for an occasional rideshare or downtown hotel date night.',
    },
    testDriveExperiment: {
      title: 'The 3-Day Suburban Airbnb Immersion',
      description: 'Rent a house in your target suburban town for a Thursday through Sunday. Do the actual train commute during Friday morning rush hour with your laptop.',
      duration: '72 Hours',
    },
  },
};

export const SAMPLE_BUSINESS_ANALYSIS: AnalysisResult = {
  id: 'business_bootstrap_vs_vc',
  decisionInput: {
    id: 'dec_sample_3',
    title: 'Bootstrap SaaS to $1M ARR vs Raise $2.5M Seed Round',
    category: 'Business',
    context: 'B2B tool currently at $18k MRR growing 12% MoM. 3 term sheets on the table at $12M post-money. Raising means scaling team to 8, bootstrapping means staying solo-founder profitable.',
    urgency: 'high',
    reversible: 'type1_irreversible',
    options: [
      { id: 'opt_1', name: 'Raise $2.5M Seed Capital', description: 'Hire engineering team, capture enterprise market fast' },
      { id: 'opt_2', name: 'Remain Bootstrapped & Profitable', description: 'Retain 100% equity, run lean, zero board meetings' },
    ],
    createdAt: Date.now() - 10800000,
  },
  timestamp: Date.now() - 10800000,
  summary: 'Weighing aggressive venture-backed land grab against complete founder sovereignty, high profit distributions, and infinite runway.',
  options: [
    {
      id: 'opt_1',
      name: 'Raise $2.5M Seed Capital',
      tagline: 'Blitzscale team, build moat, and dominate category before copycats',
      pros: [
        {
          id: 'p_b1',
          text: 'Ability to Hire 4 Senior Engineers Immediately',
          explanation: 'Removes founder engineering bottleneck and accelerates enterprise product roadmap by 14 months.',
          category: 'Growth',
          weight: 9,
        },
        {
          id: 'p_b2',
          text: 'Outpace Looming Competitive Copycats',
          explanation: 'Capital allows aggressive paid acquisition and enterprise sales reps to lock up key logos.',
          category: 'Strategic',
          weight: 8,
        },
      ],
      cons: [
        {
          id: 'c_b1',
          text: 'Dilution & Loss of Unilateral Control',
          explanation: 'Surrendering 20% equity and adding board oversight creates pressure for a $100M+ exit or bust.',
          category: 'Strategic',
          weight: 9,
        },
        {
          id: 'c_b2',
          text: 'High Monthly Burn Rate Anxiety',
          explanation: 'Hiring an 8-person team introduces a $120k/month burn rate, creating a 20-month timer to Series A.',
          category: 'Risk',
          weight: 8,
        },
      ],
      swot: {
        strengths: ['Massive capital runway for aggressive marketing', 'Institutional prestige from top-tier venture firm'],
        weaknesses: ['High monthly fixed burn rate', 'Loss of solo decision speed'],
        opportunities: ['Establish the definitive category standard', 'Acquire smaller competitor tools'],
        threats: ['Macro venture capital contraction when raising Series A in 18 months'],
      },
    },
    {
      id: 'opt_2',
      name: 'Remain Bootstrapped & Profitable',
      tagline: 'Infinite runway, 100% equity ownership, and extreme personal freedom',
      pros: [
        {
          id: 'p_b2_1',
          text: '100% Equity Ownership & Dividends',
          explanation: 'At $1M ARR with 80% margins, the founder pockets $800k/year in pure cash dividends with zero investor dilution.',
          category: 'Financial',
          weight: 10,
        },
        {
          id: 'p_b2_2',
          text: 'Zero Board Governance or Exit Timers',
          explanation: 'Total autonomy to pivot, take month-long vacations, or reject features without investor approvals.',
          category: 'Lifestyle',
          weight: 9,
        },
      ],
      cons: [
        {
          id: 'c_b2_1',
          text: 'Founder Capacity & Feature Velocity Bottleneck',
          explanation: 'Solo founder must handle support, bug fixes, marketing, and sales simultaneously.',
          category: 'Growth',
          weight: 8,
        },
      ],
      swot: {
        strengths: ['Default alive: zero risk of bankruptcy from running out of runway', 'Instantaneous decision agility'],
        weaknesses: ['Slower engineering sprint velocity without a dedicated squad'],
        opportunities: ['Attract micro-private equity buyout at 6x ARR or hold as a cash-cow'],
        threats: ['Well-funded competitor offering a free clone to capture market share'],
      },
    },
  ],
  comparisonMatrix: {
    criteria: [
      {
        name: 'Personal Life Freedom & Autonomy',
        category: 'Lifestyle',
        importance: 'Critical',
        winnerOptionId: 'opt_2',
        scores: {
          opt_1: { rating: 4, rationale: 'Bound to investor growth targets and quarterly board audits.' },
          opt_2: { rating: 10, rationale: 'Total ownership of calendar, strategy, and dividend distributions.' },
        },
      },
      {
        name: 'Market Domination & Scale Ceiling',
        category: 'Growth',
        importance: 'High',
        winnerOptionId: 'opt_1',
        scores: {
          opt_1: { rating: 9, rationale: 'Capitalizes on market window with dedicated engineering squad.' },
          opt_2: { rating: 5, rationale: 'Limited to organic reinvestment of current $18k MRR cashflow.' },
        },
      },
    ],
  },
  verdict: {
    recommendedOptionId: 'opt_2',
    recommendedOptionName: 'Remain Bootstrapped & Profitable',
    confidencePercentage: 81,
    headline: 'Stay Bootstrapped: $18k MRR at 12% MoM Is the Dream Founder Position',
    executiveRationale: 'Taking $2.5M on a $12M valuation signs you up for a high-casualty venture treadmill where a $20M acquisition is deemed a failure by your VCs. At 12% MoM growth, you will cross $50k MRR in under 10 months organically. You can hire 1-2 offshore contractors using your cash flow while keeping 100% of your equity and personal sanity.',
    theTiebreakerFactor: 'The Cash Dividend Reality: A bootstrapped founder making $800k/year in dividend profit has a higher standard of living and lower stress than a VC-backed CEO holding paper equity in a company burning $150k/month.',
    rule101010: {
      in10Minutes: 'You will feel a pang of FOMO turning down prestigious term sheets.',
      in10Months: 'You will be profitable at $60k+ MRR, sleeping soundly without burn rate anxiety.',
      in10Years: 'You will either still be collecting seven-figure cash flow or will sell for an all-cash life-changing sum where you keep 100% of the proceeds.',
    },
    devilsAdvocate: {
      blindspot: 'Assuming your personal mental stamina can handle support tickets and coding for another 12 months.',
      harshTruth: 'You cannot do everything alone without risking severe developer burnout.',
      howToMitigate: 'Use your current $18k MRR immediately to hire a high-grade fractional customer support agent and contract QA engineer.',
    },
    testDriveExperiment: {
      title: 'The 14-Day Hiring Freeze & Solo Sprint',
      description: 'Spend 2 weeks automating your 3 biggest operational drains (onboarding, billing, basic support) using modern AI agents. Measure how much engineering time you unlock before giving away 20% of your company.',
      duration: '14 Days',
    },
  },
};

export const SAMPLE_TECH_ANALYSIS: AnalysisResult = {
  id: 'tech_macbook_vs_pc',
  decisionInput: {
    id: 'dec_sample_4',
    title: 'MacBook Pro M4 Max vs Custom Liquid-Cooled PC Rig',
    category: 'Tech',
    context: 'Heavy creative workflow: 4K video editing, local LLM fine-tuning, and occasional gaming. Need reliability for client delivery while traveling 30% of the year.',
    urgency: 'low',
    reversible: 'type2_reversible',
    options: [
      { id: 'opt_1', name: 'Apple MacBook Pro M4 Max', description: '128GB Unified Memory, all-day battery, ultimate portability' },
      { id: 'opt_2', name: 'Custom RTX 5090 Desktop Rig', description: 'Raw compute monster, upgradable, lower cost per TFLOP' },
    ],
    createdAt: Date.now() - 14400000,
  },
  timestamp: Date.now() - 14400000,
  summary: 'Evaluating unified memory mobile architecture against raw desktop compute throughput and custom thermal cooling.',
  options: [
    {
      id: 'opt_1',
      name: 'Apple MacBook Pro M4 Max',
      tagline: '128GB Unified Memory portable powerhouse with elite battery and display',
      pros: [
        {
          id: 'p_t1',
          text: '128GB Unified Memory for Huge Local LLMs',
          explanation: 'Runs 70B parameter models in memory on battery power anywhere in the world.',
          category: 'Tech',
          weight: 9,
        },
        {
          id: 'p_t2',
          text: 'Zero Compromise Travel Productivity (30% of Year)',
          explanation: 'Liquid Retina XDR display and 18-hour battery allows full client editing on airplanes and coffee shops.',
          category: 'Lifestyle',
          weight: 10,
        },
      ],
      cons: [
        {
          id: 'c_t1',
          text: 'Non-Upgradable Hardware & Apple Tax',
          explanation: 'Cannot swap RAM, SSD, or GPU down the road; purchase is locked for its entire lifecycle.',
          category: 'Financial',
          weight: 7,
        },
      ],
      swot: {
        strengths: ['Best-in-class power efficiency', 'Industry leading mobile display and trackpad', 'Silent operation under load'],
        weaknesses: ['Inferior high-refresh gaming ecosystem compared to Windows'],
        opportunities: ['Seamless continuity with iPhone/iPad creative tools'],
        threats: ['New GPU architectures making fixed unified RAM obsolescent after 4 years'],
      },
    },
    {
      id: 'opt_2',
      name: 'Custom RTX 5090 Desktop Rig',
      tagline: 'Unmatched raw compute, modular upgradability, and CUDA supremacy',
      pros: [
        {
          id: 'p_t2_1',
          text: 'Unrivaled Raw CUDA Compute Throughput',
          explanation: 'RTX 5090 shatters training and rendering times with native FP8 tensor acceleration.',
          category: 'Tech',
          weight: 9,
        },
      ],
      cons: [
        {
          id: 'c_t2_1',
          text: 'Zero Travel Utility (Useless During 30% Travel Window)',
          explanation: 'Client emergencies while on the road cannot be processed on a 45-pound desktop tower.',
          category: 'Lifestyle',
          weight: 10,
        },
      ],
      swot: {
        strengths: ['Easily replaceable parts', 'Peak raw gaming and CUDA performance'],
        weaknesses: ['High power draw (850W+) and space requirements', 'Fixed to a physical desk'],
        opportunities: ['Remote streaming via Moonlight/Tailscale (requires high-bandwidth connection)'],
        threats: ['Hotel Wi-Fi latency making remote desktop editing frustrating on the road'],
      },
    },
  ],
  comparisonMatrix: {
    criteria: [
      {
        name: 'Mobile Reliability for Travel Client Delivery',
        category: 'Lifestyle',
        importance: 'Critical',
        winnerOptionId: 'opt_1',
        scores: {
          opt_1: { rating: 10, rationale: 'Edit 4K timeline on a cross-country flight on battery.' },
          opt_2: { rating: 3, rationale: 'Completely stationary; remote streaming is unreliable on hotel networks.' },
        },
      },
      {
        name: 'Raw Model Inference & Compute Speed',
        category: 'Tech',
        importance: 'High',
        winnerOptionId: 'opt_2',
        scores: {
          opt_1: { rating: 8, rationale: 'Very fast unified memory, but slower raw TFLOPs than top RTX desktop.' },
          opt_2: { rating: 10, rationale: 'Undisputed CUDA king for extreme batch generation.' },
        },
      },
    ],
  },
  verdict: {
    recommendedOptionId: 'opt_1',
    recommendedOptionName: 'Apple MacBook Pro M4 Max',
    confidencePercentage: 88,
    headline: 'MacBook Pro M4 Max: The 30% Travel Requirement Eliminates the Desktop',
    executiveRationale: 'A computer that you cannot use when sitting across from a paying client 30% of the year is a catastrophic liability. The M4 Max with 128GB unified memory allows you to run 70B parameter LLMs locally in a coffee shop or hotel room with no fan noise and zero reliance on spotty Wi-Fi.',
    theTiebreakerFactor: 'The Travel Elimination Rule: Any option that scores 3/10 on your core lifestyle constraint (30% travel) fails the viability test, regardless of how fast its desktop GPU benchmarks are.',
    rule101010: {
      in10Minutes: 'You will swallow hard looking at the Apple checkout invoice.',
      in10Months: 'You will be delivering a client edit at 35,000 feet on an airplane, thanking yourself for choosing mobility.',
      in10Years: 'This laptop will have served as your trusted command center through dozens of successful client deployments.',
    },
    devilsAdvocate: {
      blindspot: 'Assuming remote desktop streaming to your PC from hotels will be smooth.',
      harshTruth: 'Hotel and airport Wi-Fi will drop connections right when an urgent client render is needed.',
      howToMitigate: 'Use cloud GPU instances (RunPod / Lambda Labs) for rare 40-hour mega-training runs while keeping your main work on the MacBook.',
    },
    testDriveExperiment: {
      title: 'The Apple 14-Day Return Window Workflow Test',
      description: 'Order the M4 Max and run your heaviest video timeline and local model during week one. If the rendering or inference speeds disappoint, return it for 100% refund.',
      duration: '7 Days',
    },
  },
};

export const TEMPLATES: DilemmaTemplate[] = [
  {
    id: 'career_startup_vs_corp',
    badge: 'Career Move',
    title: 'Series B AI Startup VP vs Stable FAANG Principal Lead',
    category: 'Career',
    context: 'Current role is comfortable with great $320k total comp, but feeling stagnated. The startup offers 1.2% equity, fast promotion velocity, but requires 55hr weeks and runway is 22 months.',
    urgency: 'high',
    reversible: 'type2_reversible',
    options: [
      { id: 'opt_1', name: 'Join Series B AI Startup', description: 'Head of Product with equity upside and fast pace' },
      { id: 'opt_2', name: 'Stay at Enterprise FAANG', description: 'Principal role, stable salary, predictable 40-hr weeks' },
    ],
    prebuiltAnalysis: SAMPLE_STARTUP_ANALYSIS,
  },
  {
    id: 'living_city_vs_suburb',
    badge: 'Housing',
    title: 'Buy 4-Bed House in Suburbs vs Rent Downtown Penthouse',
    category: 'Lifestyle',
    context: 'First child is 18 months old. Partner works hybrid 2 days/week. Downtown gives walkable culture and zero commute, suburbs offer huge yard, top public school ratings, and equity accumulation.',
    urgency: 'medium',
    reversible: 'type1_irreversible',
    options: [
      { id: 'opt_1', name: 'Buy House in Suburbs', description: 'Spacious yard, top schools, 45-min train commute' },
      { id: 'opt_2', name: 'Continue Renting Downtown', description: 'Walkable lifestyle, vibrant culture, smaller space' },
    ],
    prebuiltAnalysis: SAMPLE_HOUSING_ANALYSIS,
  },
  {
    id: 'business_bootstrap_vs_vc',
    badge: 'Entrepreneurship',
    title: 'Bootstrap SaaS to $1M ARR vs Raise $2.5M Seed Round',
    category: 'Business',
    context: 'B2B tool currently at $18k MRR growing 12% MoM. 3 term sheets on the table at $12M post-money. Raising means scaling team to 8, bootstrapping means staying solo-founder profitable.',
    urgency: 'high',
    reversible: 'type1_irreversible',
    options: [
      { id: 'opt_1', name: 'Raise $2.5M Seed Capital', description: 'Hire engineering team, capture enterprise market fast' },
      { id: 'opt_2', name: 'Remain Bootstrapped & Profitable', description: 'Retain 100% equity, run lean, zero board meetings' },
    ],
    prebuiltAnalysis: SAMPLE_BUSINESS_ANALYSIS,
  },
  {
    id: 'tech_macbook_vs_pc',
    badge: 'Gear & Tech',
    title: 'MacBook Pro M4 Max vs Custom Liquid-Cooled PC Rig',
    category: 'Tech',
    context: 'Heavy creative workflow: 4K video editing, local LLM fine-tuning, and occasional gaming. Need reliability for client delivery while traveling 30% of the year.',
    urgency: 'low',
    reversible: 'type2_reversible',
    options: [
      { id: 'opt_1', name: 'Apple MacBook Pro M4 Max', description: '128GB Unified Memory, all-day battery, ultimate portability' },
      { id: 'opt_2', name: 'Custom RTX 5090 Desktop Rig', description: 'Raw compute monster, upgradable, lower cost per TFLOP' },
    ],
    prebuiltAnalysis: SAMPLE_TECH_ANALYSIS,
  },
];
