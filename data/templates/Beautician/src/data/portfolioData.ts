export interface ProjectItem {
  id: string;
  title: string;
  category: 'bridal' | 'editorial' | 'skincare' | 'lashes-brows' | 'nails';
  categoryLabel: string;
  description: string;
  image: string;
  beforeImage?: string;
  afterImage?: string;
  isTransformation?: boolean;
  client: string;
  techniques: string[];
  products: string[];
  duration: string;
  featured?: boolean;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  year: string;
  credentialId: string;
  description: string;
  honors?: string;
  skillsLearned: string[];
  badge: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  isCurrent?: boolean;
  description: string;
  highlights: string[];
  clientsWorkedWith?: string[];
}

export interface SkillCategory {
  category: string;
  iconName: string;
  description: string;
  skills: {
    name: string;
    level: number; // percentage
    experience: string;
    tag?: string;
  }[];
}

export interface ServiceOffering {
  id: string;
  name: string;
  category: string;
  duration: string;
  price: string;
  description: string;
  popular?: boolean;
}

export const portfolioData = {
  beautician: {
    name: "Elena Laurent",
    title: "Master Aesthetician & Luxury Bridal Artist",
    tagline: "The Home of Beauty & Pure Elegance",
    subheadline: "Crafting bespoke bridal transformations, clinical dermal rejuvenation, and high-fashion editorial artistry with uncompromising luxury.",
    experienceYears: 10,
    clientsServed: "3,500+",
    certificationsCount: "25+",
    satisfactionRate: "99.8%",
    location: "450 Rosemont Promenade, Beverly Hills, CA 90210",
    phone: "+1 (310) 892-4410",
    phoneClean: "13108924410",
    whatsapp: "+13108924410",
    email: "concierge@elenalaurentbeauty.com",
    instagram: "@elenalaurent.beauty",
    tiktok: "@elena_aesthetics",
    pinterest: "@elenalaurentartistry",
    hours: [
      { days: "Monday - Friday", time: "9:00 AM - 7:00 PM" },
      { days: "Saturday", time: "8:30 AM - 6:30 PM" },
      { days: "Sunday", time: "By Appointment Only" },
    ],
  },

  about: {
    story: "With over a decade of dedication to the art of luxury aesthetics, Elena Laurent has cultivated a signature approach that blends clinical precision with red-carpet glamour. Trained in prestigious academies across Paris and London, Elena believes true beauty is about elevating authentic radiance, restoring youthful skin vitality, and creating indelible confidence.",
    philosophy: "Every face tells a story; my craft is to ensure it is told with luminous skin, balanced proportions, and effortless sophistication.",
    keyPoints: [
      {
        title: "Clinical-Grade Sanitation",
        desc: "Hospital-grade sterilization, disposable single-use implements, and HEPA filtered private suites.",
        icon: "ShieldCheck"
      },
      {
        title: "Haute Cosmetology Formulations",
        desc: "Exclusively using medical-grade serums, cruelty-free vegan botanicals, and Dior Backstage pigments.",
        icon: "Sparkles"
      },
      {
        title: "Bespoke Facial Architecture",
        desc: "Custom diagnostics using 3D dermal scan technology prior to any aesthetic treatment.",
        icon: "Smile"
      },
      {
        title: "Private Studio Experience",
        desc: "One-on-one undivided focus in a relaxing sanctuary with organic herbal infusions and aromatherapy.",
        icon: "Crown"
      }
    ]
  },

  education: [
    {
      id: "edu-1",
      degree: "CIDESCO International Master Diploma in Beauty Therapy & Cosmetology",
      institution: "International Dermal Institute & CIDESCO Section",
      location: "Zurich / London",
      year: "2014 - 2016",
      credentialId: "CID-948210-UK",
      honors: "Summa Cum Laude with Highest Clinical Distinction",
      description: "Gold-standard global beauty qualification covering advanced dermatological analysis, galvanic iontophoresis, facial muscle physiology, chemistry of cosmetics, and clinical hygiene protocols.",
      skillsLearned: ["Clinical Skin Diagnostics", "Advanced Dermal Chemistry", "Lymphatic Drainage", "Electrical Facials"],
      badge: "CIDESCO Gold Standard"
    },
    {
      id: "edu-2",
      degree: "Masterclass Certification in Haute Bridal & Editorial Makeup Artistry",
      institution: "London Academy of Media & Fashion Make-up",
      location: "London, UK",
      year: "2016 - 2017",
      credentialId: "LAMFM-8831",
      honors: "Voted Best Editorial Portfolio of the Year",
      description: "Intensive specialization in high-definition bridal longevity, airbrush contouring, lighting theory for photography, and bespoke color theory for diverse skin undertones.",
      skillsLearned: ["HD Airbrushing", "Color Corrective Theory", "Lighting & Camera Artistry", "Tear-Proof Bridal Setting"],
      badge: "Master Makeup Artistry"
    },
    {
      id: "edu-3",
      degree: "Advanced Clinical Dermal & Micro-Needling Specialist Diploma",
      institution: "Swiss Aesthetic & Dermatological Academy",
      location: "Geneva, Switzerland",
      year: "2019",
      credentialId: "SADA-D7712",
      honors: "Certified Dermal Specialist Level 4",
      description: "Comprehensive scientific training on collagen induction therapy, non-ablative rejuvenation, bespoke chemical peels, and post-procedure barrier restoration.",
      skillsLearned: ["Micro-Needling", "Enzyme Peels", "HydraGlow Protocols", "Barrier Repair Therapy"],
      badge: "Clinical Skin Specialist"
    },
    {
      id: "edu-4",
      degree: "International Russian Volume Lash & Brow Architecture Master Accreditation",
      institution: "Lash & Brow Academy Paris",
      location: "Paris, France",
      year: "2021",
      credentialId: "LBA-PARIS-2041",
      honors: "Grand Prix Brow Sculptor Certified",
      description: "Master level certification in hyper-realistic brow micro-lamination, bespoke mapping according to golden ratio facial harmony, and weightless Russian volume fan creation.",
      skillsLearned: ["Brow Lamination", "Golden Ratio Mapping", "Russian 3D-6D Volume", "Keratin Lash Infusion"],
      badge: "Brow & Lash Master"
    }
  ] as EducationItem[],

  experience: [
    {
      id: "exp-1",
      role: "Founder & Lead Master Aesthetician",
      company: "Elena Laurent Beauty Sanctuary",
      location: "Beverly Hills, CA",
      period: "2022 - Present",
      isCurrent: true,
      description: "Directing an exclusive private studio offering bespoke bridal styling suites, clinical dermal revitalization, and beauty consultations for high-profile clients.",
      highlights: [
        "Curated over 450+ exclusive luxury bridal looks with 100% 5-star acclaim.",
        "Introduced signature 'HydraGlow Diamond Infusion' treatment with zero downtime.",
        "Featured in Beverly Hills Lifestyle & Modern Luxury Weddings."
      ],
      clientsWorkedWith: ["Celebrity Weddings", "Red Carpet Galas", "Private Editorial"]
    },
    {
      id: "exp-2",
      role: "Senior Editorial & Fashion Week Makeup Artist",
      company: "Elite Atelier Productions",
      location: "Paris / New York / Milan",
      period: "2018 - 2022",
      isCurrent: false,
      description: "Led backstage beauty teams for prestigious runway shows and luxury campaign photoshoots, creating versatile camera-ready makeup tailored to high-definition 8K lenses.",
      highlights: [
        "Head Makeup Director for 14 seasonal runway showcases during NYFW and Paris Haute Couture.",
        "Collaborated with internationally renowned photographers and fashion publications.",
        "Formulated proprietary long-wear setting techniques resistant to intense studio lights."
      ],
      clientsWorkedWith: ["Vogue Editorial", "Harper's Bazaar", "Milan Fashion Week Runway"]
    },
    {
      id: "exp-3",
      role: "Lead Dermal & Bridal Specialist",
      company: "Le Spa Royal & Wellness Club",
      location: "London, UK",
      period: "2015 - 2018",
      isCurrent: false,
      description: "Delivered customized high-end skin rejuvenation therapies, pre-wedding beauty regimes, and full bridal party styling packages at a premier 5-star hotel spa.",
      highlights: [
        "Achieved highest client rebooking rate (94%) across 3 consecutive years.",
        "Conducted skin analysis diagnostics and customized homecare regimens for over 2,000 guests.",
        "Mentored a team of 8 junior therapists in sterile techniques and bridal longevity."
      ]
    },
    {
      id: "exp-4",
      role: "Aesthetic Apprentice & Nail Artist",
      company: "The Rose & Gold Boutique Salon",
      location: "London, UK",
      period: "2013 - 2015",
      isCurrent: false,
      description: "Began journey under master French cosmetologists, mastering Russian manicures, nail sculpting, skin anatomy, and organic product compounding.",
      highlights: [
        "Mastered advanced sculpting with odorless hard gels and precision cuticle treatment.",
        "Completed 500+ hours of hands-on salon apprenticeships."
      ]
    }
  ] as ExperienceItem[],

  projects: [
    {
      id: "proj-1",
      title: "Royal Luminescence Bridal Transformation",
      category: "bridal",
      categoryLabel: "Bridal Artistry",
      description: "A timeless, glowing bridal look crafted for a summer destination wedding in Lake Como. Focused on ethereal glass skin, soft rose-gold sculpting, and tear-resistant veil-proof longevity.",
      image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80",
      beforeImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
      afterImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      isTransformation: true,
      client: "Lady Victoria H.",
      techniques: ["Airbrush Glow Base", "Subtle Cut-Crease", "Custom Feathered Lashes", "Lip Plumping Stain"],
      products: ["Charlotte Tilbury Hollywood Flawless Filter", "Dior Backstage Palette", "Tom Ford Shade & Illuminate"],
      duration: "3.5 Hours",
      featured: true,
    },
    {
      id: "proj-2",
      title: "Hydra-Peptide Glass Skin Facial",
      category: "skincare",
      categoryLabel: "Clinical Skincare",
      description: "Deep dermal oxygenation and triple hyaluronic infusion resulting in immediate pore refinement, restored barrier resilience, and unmatched natural luminosity.",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80",
      beforeImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
      afterImage: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=80",
      isTransformation: true,
      client: "Camilla R., Executive",
      techniques: ["Ultrasonic Cavitation", "Lactic Acid Infusion", "Cold Cryo-Sculpting", "LED Collagen Therapy"],
      products: ["SkinCeuticals C E Ferulic", "Biologique Recherche P50", "Valmont Prime Renewing Pack"],
      duration: "75 Minutes",
      featured: true,
    },
    {
      id: "proj-3",
      title: "Editorial Haute Couture Red Carpet",
      category: "editorial",
      categoryLabel: "Editorial & Runway",
      description: "High-impact editorial aesthetic created for Cannes Film Festival red carpet. Featuring smoked bronze metallic eyes, sculpted dewy cheekbones, and velvet nude lips.",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80",
      client: "Sora M., Model & Actress",
      techniques: ["Editorial Contouring", "Individual Mink Fan Placement", "Micro-Glow Highlighting", "Velvet Seal"],
      products: ["Pat McGrath Labs Mothership", "NARS Radiant Creamy", "Chanel Rouge Allure"],
      duration: "2 Hours",
      featured: true,
    },
    {
      id: "proj-4",
      title: "Golden Ratio Brow Lamination & Lash Lift",
      category: "lashes-brows",
      categoryLabel: "Lashes & Brows",
      description: "Bespoke brow reshaping, keratin lift, and custom tinting that perfectly complements the client's bone structure, yielding a lifted, youthful open-eye effect.",
      image: "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=1200&q=80",
      beforeImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      afterImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      isTransformation: true,
      client: "Genevieve K.",
      techniques: ["Keratin Deep Infusion", "Golden Proportion Mapping", "Custom Hybrid Tint", "Nourishing Oil Shield"],
      products: ["Elleebana Keratin", "RefectoCil Hybrid Tint", "Castor Peptide Serum"],
      duration: "90 Minutes",
    },
    {
      id: "proj-5",
      title: "Rose Gold Quartz & Pearl Gel Couture",
      category: "nails",
      categoryLabel: "Luxury Nail Art",
      description: "Dry Russian manicure technique combined with hand-painted marble quartz veins, crushed 24k gold leaf flakes, and diamond hard gel overlay.",
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80",
      client: "Sophia V.",
      techniques: ["Russian E-File Cuticle Sculpt", "Multi-Layer Gel Marbling", "24K Gold Leaf Inlay", "Gloss UV Topcoat"],
      products: ["Apres Gel-X", "Akzentz Trinity Gel", "Swarovski Crystals"],
      duration: "105 Minutes",
    },
    {
      id: "proj-6",
      title: "Bohemian Sunset Romance Bridal",
      category: "bridal",
      categoryLabel: "Bridal Artistry",
      description: "Warm terracotta and peach tones designed for an outdoor golden-hour vineyard ceremony. Waterproof, sweat-resistant, and radiant under sunset illumination.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
      client: "Isabella T.",
      techniques: ["Warm Monochromatic Glow", "Feathered Waterproof Brows", "Sunset Peach Blush Stacking"],
      products: ["Hourglass Ambient Lighting", "Rare Beauty Soft Pinch", "Charlotte Tilbury Pillow Talk"],
      duration: "3 Hours",
    },
    {
      id: "proj-7",
      title: "Dermaplaning & Peptide Flash Glow",
      category: "skincare",
      categoryLabel: "Clinical Skincare",
      description: "Gentle medical blade exfoliation to remove vellus hair and dead stratum corneum, followed by pure peptide infusion and cryo jade rolling.",
      image: "https://images.unsplash.com/photo-1512290900672-1f02e0a09b3b?auto=format&fit=crop&w=1200&q=80",
      client: "Elena W., Fashion Stylist",
      techniques: ["Surgical Grade Dermaplaning", "Bio-Cellulose Peptide Sheet", "Cryotherapy Sculpting"],
      products: ["Dermalogica BioLumin-C", "iS Clinical Active Serum", "La Mer Treatment Lotion"],
      duration: "60 Minutes",
    },
    {
      id: "proj-8",
      title: "Russian 4D Velvet Cashmere Lashes",
      category: "lashes-brows",
      categoryLabel: "Lashes & Brows",
      description: "Ultra-lightweight handmade cashmere fans applied with surgical adhesive for a full, fluffy, yet weightless butterfly effect that protects natural lash health.",
      image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1200&q=80",
      client: "Audrey D.",
      techniques: ["0.05 Ultra-Fine Fan Crafting", "Eye-Shape Isolation Mapping", "Nano-Mist Polymerization"],
      products: ["London Lash Pro Cashmere", "Medical Cyanoacrylate", "Soothing Collagen Under-Eye Pads"],
      duration: "120 Minutes",
    }
  ] as ProjectItem[],

  skillCategories: [
    {
      category: "Haute Makeup & Bridal Artistry",
      iconName: "Sparkles",
      description: "Mastery of complexion illumination, facial contour architecture, and climate-resistant longevity.",
      skills: [
        { name: "HD Airbrush Base & Glass Complexion", level: 98, experience: "10 Yrs", tag: "Signature" },
        { name: "Bridal Architecture & Tear-Proof Setting", level: 99, experience: "10 Yrs", tag: "Award Winning" },
        { name: "Editorial & High-Definition Color Grading", level: 95, experience: "8 Yrs" },
        { name: "Mature Skin Rejuvenation Artistry", level: 94, experience: "9 Yrs" },
        { name: "Melanin-Rich & Undertone Harmonization", level: 97, experience: "10 Yrs" },
      ]
    },
    {
      category: "Advanced Dermal & Clinical Aesthetics",
      iconName: "Smile",
      description: "Scientific facial therapies focusing on dermal cell regeneration, collagen induction, and barrier recovery.",
      skills: [
        { name: "HydraGlow & Ultrasonic Dermal Infusion", level: 96, experience: "7 Yrs", tag: "Most Booked" },
        { name: "Medical Dermaplaning & Epidermal Resurfacing", level: 95, experience: "8 Yrs" },
        { name: "Custom Botanical & Acid Peels (AHA/BHA)", level: 92, experience: "6 Yrs" },
        { name: "LED Phototherapy & Collagen Boosting", level: 94, experience: "7 Yrs" },
        { name: "Facial Sculpting & Lymphatic Gua Sha", level: 96, experience: "9 Yrs" },
      ]
    },
    {
      category: "Lash Architecture & Brow Couture",
      iconName: "Eye",
      description: "Precision framing for the eyes using mathematical facial balance and nourishing keratin botanicals.",
      skills: [
        { name: "Golden Ratio Eyebrow Mapping & Architecture", level: 98, experience: "9 Yrs", tag: "Precision" },
        { name: "Keratin Brow Lamination & Hybrid Tinting", level: 95, experience: "5 Yrs" },
        { name: "Russian 3D-6D Featherlight Volume Lashes", level: 93, experience: "6 Yrs" },
        { name: "Keratin Lash Lift & Deep Vitamin Glaze", level: 96, experience: "8 Yrs" },
      ]
    },
    {
      category: "Nail Couture & Russian Spa Care",
      iconName: "Heart",
      description: "Dry e-file hygiene protocols and hand-crafted gel extensions with jewelry-grade finishes.",
      skills: [
        { name: "Russian E-File Precision Cuticle Therapy", level: 95, experience: "8 Yrs", tag: "Zero Trauma" },
        { name: "Hard Gel Architecture & Aprés Gel-X", level: 94, experience: "7 Yrs" },
        { name: "Hand-Painted Nail Art, Quartz & Gold Leaf", level: 91, experience: "6 Yrs" },
        { name: "Deep Paraffin & Anti-Aging Hand Spa", level: 93, experience: "8 Yrs" },
      ]
    }
  ] as SkillCategory[],

  services: [
    {
      id: "srv-1",
      name: "The Royal Bridal Experience",
      category: "Bridal",
      duration: "3.5 Hours + Trial",
      price: "$650",
      description: "Comprehensive luxury bridal package: full consultation, preview trial session, skin preparation, HD airbrush makeup, lash customization, and emergency touch-up kit.",
      popular: true
    },
    {
      id: "srv-2",
      name: "Diamond HydraGlow Facial Therapy",
      category: "Skincare",
      duration: "75 Minutes",
      price: "$240",
      description: "Hydro-dermabrasion exfoliation, peptide booster infusion, cold cryo tightening, and soothing collagen mask for immediate red-carpet radiance.",
      popular: true
    },
    {
      id: "srv-3",
      name: "Signature Brow Lamination & Hybrid Tint",
      category: "Brows & Lashes",
      duration: "60 Minutes",
      price: "$135",
      description: "Facial symmetry mapping, keratin brow restructuring, customized long-wear tint, and nourishing argan oil finishing seal."
    },
    {
      id: "srv-4",
      name: "Russian Volume Lashes (Full Glam Set)",
      category: "Brows & Lashes",
      duration: "120 Minutes",
      price: "$220",
      description: "Handmade lightweight 3D-5D cashmere bouquets tailored to eye contour for rich, fluffy density without damaging natural lash fibers."
    },
    {
      id: "srv-5",
      name: "Haute Russian Gel-X Couture Manicure",
      category: "Nails",
      duration: "90 Minutes",
      price: "$150",
      description: "Non-toxic dry manicure, cuticle refinement, customized shape extension, and bespoke luxury nail art."
    },
    {
      id: "srv-6",
      name: "Red Carpet / Special Event Glamour",
      category: "Makeup",
      duration: "90 Minutes",
      price: "$210",
      description: "Full editorial makeup styling with custom false lash placement, dewy contouring, and 16-hour setting shield."
    }
  ] as ServiceOffering[],

  testimonials: [
    {
      quote: "Elena transformed my entire wedding morning into pure tranquility. My makeup didn't budge through happy tears, dancing, and 14 hours of photos. Truly a world-class artist!",
      author: "Victoria Sterling",
      role: "Lake Como Bride",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    {
      quote: "The HydraGlow facial is miraculous. My skin was glowing for weeks, with pores practically invisible. Elena's private studio is the definition of luxury and hygiene.",
      author: "Camilla Rothschild",
      role: "Beverly Hills Regular",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
    },
    {
      quote: "Elena's brow lamination gave me the brows of my dreams. Her understanding of facial symmetry and gentle technique is unmatched anywhere in California.",
      author: "Genevieve Moreau",
      role: "Fashion Editor",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80"
    }
  ],

  brandPartners: [
    "Dior Backstage", "Charlotte Tilbury", "Biologique Recherche", "SkinCeuticals", "Tom Ford Beauty", "London Lash Pro", "Aprés Gel-X"
  ]
};
