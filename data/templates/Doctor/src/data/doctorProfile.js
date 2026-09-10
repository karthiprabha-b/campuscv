
export const doctorProfile = {
  name: "Dr. Elena Vance",
  honorific: "MD, FACP, FACC",
  primaryTitle: "Consultant Physician & Cardiometabolic Specialist",
  secondaryTitle: "Director of Preventive Healthcare & Chronic Disease Center",
  registrationNumber: "MCI-584920-R",
  council: "National Medical Council & American Board of Internal Medicine",
  tagline: "Compassionate Care. Expert Medicine.",
  shortBio:
    "Dedicated to advancing patient health through evidence-informed clinical practice, personalized preventive care, and compassionate listening. With over 15 years in clinical practice, Dr. Vance integrates advanced diagnostic technology with tailored lifestyle and clinical interventions.",
  fullBio: [
    "Dr. Elena Vance is a dual board-certified Consultant Physician and Cardiometabolic Specialist with over fifteen years of distinguished clinical experience across premier academic medical centres and tertiary hospitals.",
    "Her clinical practice centers on comprehensive internal medicine, early cardiovascular risk mitigation, and the management of complex multimorbidities including type 2 diabetes, resistant hypertension, and metabolic syndrome.",
    "A firm advocate for patient-centric medicine, Dr. Vance combines rigorous evidence-based protocols with empathetic, clear communication—ensuring every individual receives a holistic, achievable roadmap to long-term vitality.",
  ],
  medicalPhilosophy: {
    quote:
      "Medicine is neither just science nor mere symptom alleviation—it is an enduring partnership built on deep listening, scientific rigor, and an unwavering commitment to the human being behind every diagnosis.",
    authorAttribution: "Dr. Elena Vance, MD",
  },
  heroPortrait:
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=1000",
  aboutPortrait:
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1000",
  secondaryPortrait:
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1000",
  stats: [
    {
      value: "15+",
      numericValue: 15,
      suffix: "Years",
      label: "Years of Experience",
      subtext: "Clinical practice & hospital consultations",
    },
    {
      value: "12,500+",
      numericValue: 12500,
      suffix: "Patients",
      label: "Patients Consulted",
      subtext: "Across inpatient & outpatient care",
    },
    {
      value: "99.2%",
      numericValue: 99.2,
      suffix: "%",
      label: "Patient Satisfaction",
      subtext: "Based on verified clinical feedback",
    },
    {
      value: "28+",
      numericValue: 28,
      suffix: "Papers",
      label: "Peer-Reviewed Research",
      subtext: "Published in international journals",
    },
  ],
  keyCredentials: [
    "MBBS (First Class Honors)",
    "MD - Internal Medicine",
    "Fellow, American College of Physicians (FACP)",
    "Fellow, American College of Cardiology (FACC)",
    "Registered Medical Practitioner (#584920)",
  ],
  languages: ["English (Fluent)", "Spanish (Conversational)", "Hindi (Fluent)"],
  consultationTypes: [
    {
      type: "In-Person Clinic Visit",
      duration: "45 mins",
      description: "Thorough physical assessment, diagnostic review, and tailored treatment planning.",
      isAvailable: true,
    },
    {
      type: "Virtual Teleconsultation",
      duration: "30 mins",
      description: "Secure, HIPAA-compliant follow-up consultations and prescription management.",
      isAvailable: true,
    },
    {
      type: "Executive Health Assessment",
      duration: "90 mins",
      description: "Comprehensive multi-system preventive health screening and longevity profiling.",
      isAvailable: true,
    },
  ],
  specializations: [
    {
      id: "preventive-cardiology",
      title: "Preventive Cardiology",
      badge: "Primary Specialty",
      icon: "HeartPulse",
      shortDescription:
        "Proactive cardiovascular risk assessment, lipidology, coronary artery disease prevention, and post-infarction care.",
      detailedDescription:
        "Utilizing advanced risk stratification tools like coronary calcium scoring, advanced lipid panels (ApoB, Lp(a)), and personalized exercise/nutrition guidance to arrest and reverse early vascular damage.",
      conditionsTreated: [
        "Atherosclerosis & Coronary Artery Disease",
        "Familial Hypercholesterolemia & Dyslipidemia",
        "Essential & Refractory Hypertension",
        "Early Heart Failure & Arrhythmia Screening",
      ],
      commonProcedures: [
        "12-Lead Electrocardiogram (ECG) Analysis",
        "Echocardiogram Interpretation",
        "24-Hour Holter & Ambulatory Blood Pressure Monitoring",
        "Advanced Lipid Profile Assessment",
      ],
      featured: true,
    },
    {
      id: "diabetes-metabolism",
      title: "Diabetes & Metabolic Health",
      badge: "Chronic Care",
      icon: "Activity",
      shortDescription:
        "Comprehensive management of Type 1 & Type 2 Diabetes, Insulin Resistance, and Metabolic Syndrome.",
      detailedDescription:
        "Integrated metabolic protocols combining continuous glucose monitoring (CGM), modern GLP-1/SGLT2 therapies, and sustainable lifestyle modifications to achieve long-term glycemic stability.",
      conditionsTreated: [
        "Type 2 Diabetes Mellitus & Prediabetes",
        "Metabolic Syndrome & Insulin Resistance",
        "Non-Alcoholic Fatty Liver Disease (NAFLD/MASLD)",
        "Diabetic Microvascular Complications",
      ],
      commonProcedures: [
        "Continuous Glucose Monitoring (CGM) Setup",
        "Insulin Regimen Optimization",
        "Microalbuminuria & Renal Function Surveillance",
        "Diabetic Neuropathy Screening",
      ],
      featured: true,
    },
    {
      id: "internal-medicine",
      title: "General & Complex Internal Medicine",
      badge: "Diagnostic Excellence",
      icon: "Stethoscope",
      shortDescription:
        "Accurate diagnosis and therapeutic management of acute and multisystem adult medical illnesses.",
      detailedDescription:
        "Holistic care for complex diagnostic dilemmas, prolonged fevers, autoimmune manifestations, and polymedicated geriatric patients needing coordinated care.",
      conditionsTreated: [
        "Multi-Organ Chronic Diseases",
        "Unexplained Fatigue & Systemic Inflammatory Disorders",
        "Respiratory Infections & Asthma/COPD",
        "Gastrointestinal & Acid Peptic Disorders",
      ],
      commonProcedures: [
        "Comprehensive Physical & Systemic Examination",
        "Diagnostic Ultrasound Coordination",
        "Polypharmacy Review & Deprescribing",
        "Adult Immunization & Prophylaxis",
      ],
      featured: true,
    },
    {
      id: "hypertension-vascular",
      title: "Hypertension & Vascular Medicine",
      badge: "Specialized Care",
      icon: "ShieldAlert",
      shortDescription:
        "Targeted management of resistant hypertension, secondary hypertension, and arterial health.",
      detailedDescription:
        "In-depth investigation of underlying endocrine, vascular, or renal causes of high blood pressure, followed by targeted multi-agent therapies.",
      conditionsTreated: [
        "Resistant & White-Coat Hypertension",
        "Secondary Hypertension (Renal, Endocrine)",
        "Peripheral Artery Disease Screening",
        "Orthostatic Hypotension & Dysautonomia",
      ],
      commonProcedures: [
        "Central Aortic Blood Pressure Measurement",
        "Ankle-Brachial Index (ABI) Screening",
        "Renal Artery Doppler Interpretation",
        "Secondary Endocrine Workup",
      ],
      featured: false,
    },
    {
      id: "longevity-preventive",
      title: "Executive & Preventive Longevity",
      badge: "Wellness",
      icon: "Sparkles",
      shortDescription:
        "Evidence-backed longevity medicine, biomarker optimization, sleep hygiene, and biological age preservation.",
      detailedDescription:
        "Proactive health optimization designed for professionals seeking peak mental, physical, and cellular performance through proactive biomarker tracking.",
      conditionsTreated: [
        "Age-Related Functional Decline",
        "Chronic Subclinical Inflammation (Inflammaging)",
        "Sleep Architecture Disruption",
        "Nutritional & Micronutrient Deficiencies",
      ],
      commonProcedures: [
        "Comprehensive Biomarker Panel Analysis",
        "Cardiorespiratory Fitness (VO2 Max) Counseling",
        "Bone Mineral Density & Dexa Interpretation",
        "Personalized Supplement & Lifestyle Architecture",
      ],
      featured: false,
    },
    {
      id: "womens-cardiometabolic",
      title: "Women's Cardiometabolic Health",
      badge: "Dedicated Focus",
      icon: "UserCheck",
      shortDescription:
        "Specialized cardiovascular and endocrine care across menopause transition, PCOS, and gestational history.",
      detailedDescription:
        "Tailored care addressing the unique vascular and hormonal transitions women experience, including post-preeclampsia cardiovascular vigilance and hormone-related metabolic shifts.",
      conditionsTreated: [
        "PCOS-Related Insulin Resistance & Lipids",
        "Post-Menopausal Cardiovascular Risk",
        "Microvascular Angina in Women",
        "Gestational Diabetes Follow-up Care",
      ],
      commonProcedures: [
        "Hormone-Metabolic Cross Analysis",
        "Endothelial Function Evaluation",
        "Tailored HRT-Cardiovascular Safety Consultation",
        "Pelvic-Metabolic Risk Profiling",
      ],
      featured: false,
    },
  ],
  experience: [
    {
      id: "exp-1",
      role: "Senior Consultant Physician & Head of Preventive Medicine",
      institution: "Metropolitan Academic Medical Center",
      location: "Boston, MA",
      period: "2020 – Present",
      isCurrent: true,
      department: "Department of Medicine & Cardiovascular Prevention",
      description:
        "Leading outpatient consultative services and inpatient medical wards. Spearheaded the institution's Cardiometabolic Prevention Clinic, managing a multidisciplinary team of physicians, dietitians, and clinical nurses.",
      highlights: [
        "Established the region's first early-intervention Cardiometabolic Risk Clinic, serving 3,000+ patients annually.",
        "Authored institutional protocols on continuous glucose monitoring integration in primary care.",
        "Recipient of the Physician Excellence & Compassion Award in 2023.",
      ],
    },
    {
      id: "exp-2",
      role: "Consultant Physician & Assistant Professor of Medicine",
      institution: "University Health Sciences & Memorial Hospital",
      location: "Philadelphia, PA",
      period: "2015 – 2020",
      isCurrent: false,
      department: "Division of General Internal Medicine",
      description:
        "Provided tertiary clinical care, supervised medical residents and fellows, and led clinical trials on novel lipid-lowering and SGLT-2 inhibitor therapeutics.",
      highlights: [
        "Supervised and mentored 45+ medical residents in evidence-based clinical decision making.",
        "Principal investigator on two clinical trials on secondary cardiovascular prevention.",
        "Appointed Chair of the Pharmacy and Therapeutics Formulary Committee (2018–2020).",
      ],
    },
    {
      id: "exp-3",
      role: "Senior Clinical Fellow & Chief Resident",
      institution: "St. Jude University Medical Center",
      location: "Baltimore, MD",
      period: "2011 – 2015",
      isCurrent: false,
      department: "Department of Internal Medicine",
      description:
        "Completed rigorous clinical residency and chief residency, leading the medical intensive care unit (MICU) rotation and emergency triage teams.",
      highlights: [
        "Awarded Outstanding Resident Physician of the Year (2014).",
        "Published 6 peer-reviewed clinical case studies and meta-analyses during tenure.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "Doctor of Medicine (MD)",
      field: "Internal Medicine & Clinical Therapeutics",
      institution: "Johns Hopkins University School of Medicine",
      location: "Baltimore, MD",
      year: "2011",
      honors: "Summa Cum Laude / Alpha Omega Alpha Honor Society",
      description:
        "Extensive clinical rotations with distinction in cardiovascular medicine, nephrology, and intensive critical care.",
    },
    {
      id: "edu-2",
      degree: "Bachelor of Medicine, Bachelor of Surgery (MBBS)",
      field: "Medicine & Surgery",
      institution: "King Edward Medical University",
      location: "London, UK / Global Track",
      year: "2007",
      honors: "University Gold Medal in Clinical Pathology & Medicine",
      description:
        "Rigorous foundational medical education with distinction in physiology, pharmacology, and clinical therapeutics.",
    },
    {
      id: "edu-3",
      degree: "Postgraduate Fellowship in Preventive Cardiology",
      field: "Cardiovascular Prevention & Lipidology",
      institution: "Harvard Medical School / Brigham and Women's Hospital",
      location: "Boston, MA",
      year: "2016",
      honors: "Clinical Research Fellow",
      description:
        "Advanced subspecialty fellowship focusing on advanced lipidology, atherosclerosis imaging, and cardiometabolic syndrome.",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "Board Certified in Internal Medicine",
      authority: "American Board of Internal Medicine (ABIM)",
      year: "2014, Recertified 2024",
      credentialId: "ABIM-392810",
      status: "Active",
    },
    {
      id: "cert-2",
      name: "Fellow of the American College of Physicians (FACP)",
      authority: "American College of Physicians",
      year: "2018",
      credentialId: "FACP-94812",
      status: "Lifetime",
    },
    {
      id: "cert-3",
      name: "Diplomate, American Board of Clinical Lipidology",
      authority: "National Lipid Association",
      year: "2019",
      credentialId: "ABCL-10492",
      status: "Active",
    },
    {
      id: "cert-4",
      name: "Advanced Cardiac Life Support (ACLS) Instructor",
      authority: "American Heart Association",
      year: "Current / Active 2026",
      credentialId: "AHA-ACLS-9921",
      status: "Active",
    },
  ],
  achievements: [
    {
      id: "ach-1",
      title: "Distinguished Physician Award in Clinical Excellence",
      organization: "National Medical Association",
      year: "2024",
      category: "Award",
      description:
        "Awarded for outstanding contributions to preventive cardiometabolic care and lowering rehospitalization rates.",
      badge: "National Honor",
    },
    {
      id: "ach-2",
      title: "Keynote Speaker: International Congress on Metabolic Health",
      organization: "World Federation of Internal Medicine",
      year: "2023",
      category: "Leadership",
      description:
        "Delivered the presidential keynote on 'The Convergence of GLP-1 Biology and Atherosclerosis Reversal' to 2,400 delegates.",
      badge: "Keynote Address",
    },
    {
      id: "ach-3",
      title: "Excellence in Medical Resident Mentorship",
      organization: "Metropolitan Academic Medical Center",
      year: "2022",
      category: "Recognition",
      description:
        "Voted best clinical faculty educator by the graduating residency class of 2022.",
      badge: "Education Award",
    },
    {
      id: "ach-4",
      title: "Research Grant: AI-Assisted Early Microvascular Risk Detection",
      organization: "Health Research Foundation",
      year: "2021",
      category: "Research",
      description:
        "Lead co-investigator on a $450,000 multi-center grant deploying machine learning models for early diabetic endothelial dysfunction.",
      badge: "$450k Grant",
    },
  ],
  publications: [
    {
      id: "pub-1",
      title:
        "Longitudinal Impact of Apolipoprotein B Target Attainment on Coronary Atheroma Burden: A 5-Year Cohort Study",
      journal: "Journal of the American College of Cardiology (JACC)",
      year: "2024",
      volume: "Vol. 83, Issue 14, pp. 1420-1432",
      category: "Preventive Cardiology",
      doi: "10.1016/j.jacc.2024.02.019",
      link: "https://pubmed.ncbi.nlm.nih.gov",
      citations: 42,
      abstract:
        "A multi-center cohort investigation demonstrating that aggressive ApoB lowering (<50 mg/dL) halted progression of coronary plaque volume measured by serial coronary CT angiography in high-risk metabolic patients.",
    },
    {
      id: "pub-2",
      title:
        "Dual SGLT2 and GLP-1 Receptor Agonism in Resistant Diabetic Hypertension: Mechanistic Insights and Clinical Outcomes",
      journal: "The Lancet Diabetes & Endocrinology",
      year: "2023",
      volume: "Vol. 11, Issue 8, pp. 589-601",
      category: "Endocrinology & Metabolism",
      doi: "10.1016/S2213-8587(23)00145-2",
      link: "https://pubmed.ncbi.nlm.nih.gov",
      citations: 88,
      abstract:
        "Evaluating synergistic renal hemodynamics and central blood pressure reductions when combining second-generation GLP-1 receptor agonists with SGLT2 inhibitors in multimorbid patients.",
    },
    {
      id: "pub-3",
      title:
        "Patient-Centered Continuous Glucose Monitoring in Primary Care: A Randomized Controlled Implementation Trial",
      journal: "New England Journal of Medicine Evidence",
      year: "2022",
      volume: "Vol. 1, Issue 4",
      category: "Clinical Implementation",
      doi: "10.1056/EVIDoa2200045",
      link: "https://pubmed.ncbi.nlm.nih.gov",
      citations: 64,
      abstract:
        "Demonstrated significant reduction in HbA1c (-1.2%) and sustained behavioral adherence when real-time CGM data was integrated with structured physician telehealth touchpoints.",
    },
    {
      id: "pub-4",
      title:
        "Gender Disparities in Early Presentation of Coronary Microvascular Dysfunction: Diagnostic Pitfalls and Best Practices",
      journal: "Circulation: Cardiovascular Quality and Outcomes",
      year: "2021",
      volume: "Vol. 14, Issue 6, e007892",
      category: "Women's Health",
      doi: "10.1161/CIRCOUTCOMES.120.007892",
      link: "https://pubmed.ncbi.nlm.nih.gov",
      citations: 110,
      abstract:
        "Comprehensive review and observational series outlining the under-recognition of ischemia with non-obstructive coronary arteries (INOCA) in female patients presenting with atypical angina.",
    },
  ],
  testimonials: [
    {
      id: "test-1",
      patientName: "Robert M., 56",
      treatmentCategory: "Preventive Cardiology & Diabetes",
      rating: 5,
      date: "August 2025",
      verifiedPatient: true,
      quote:
        "Dr. Vance transformed my health trajectory. After years of struggling with escalating blood pressure and borderline diabetes, she took the time to explain the 'why' behind every number. Six months into her tailored plan, my HbA1c is normal and I've halved my medications safely.",
    },
    {
      id: "test-2",
      patientName: "Sarah L., 44",
      treatmentCategory: "Cardiometabolic & Lifestyle Health",
      rating: 5,
      date: "June 2025",
      verifiedPatient: true,
      quote:
        "It is rare to find a physician who combines top-tier academic expertise with such genuine warmth and patience. Dr. Vance never rushed our consultations. Her guidance on continuous glucose tracking was an absolute game changer for my energy and longevity.",
    },
    {
      id: "test-3",
      patientName: "David K., 62",
      treatmentCategory: "Complex Internal Medicine",
      rating: 5,
      date: "April 2025",
      verifiedPatient: true,
      quote:
        "I was referred to Dr. Elena Vance after seeing multiple doctors without a clear diagnosis for severe systemic inflammation and fatigue. Her thorough, methodical approach identified the root cause in weeks. I cannot recommend her highly enough.",
    },
    {
      id: "test-4",
      patientName: "Dr. Ananya P., 50",
      treatmentCategory: "Executive Health Assessment",
      rating: 5,
      date: "February 2025",
      verifiedPatient: true,
      quote:
        "As a fellow healthcare professional, I am extremely discerning when choosing a physician for my own family. Dr. Vance's adherence to cutting-edge clinical evidence, paired with her impeccable bedside manner, makes her one of the very best physicians practicing today.",
    },
  ],
  clinic: {
    name: "Beacon Health Medical Pavilion & Consulting Suites",
    facilityType: "Private Consulting Suites & Diagnostics",
    addressLine1: "Suite 450, 750 Medical Center Boulevard",
    addressLine2: "Beacon Health Academic Campus",
    city: "Boston",
    stateZip: "MA 02115",
    phone: "+1 (617) 555-0194",
    emergencyPhone: "+1 (617) 555-0911",
    email: "consultations@drelenavance.com",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Boston+Medical+Center&t=&z=13&ie=UTF8&iwloc=&output=embed",
    hours: [
      { days: "Monday – Thursday", time: "08:30 AM – 05:00 PM" },
      { days: "Friday", time: "08:30 AM – 02:00 PM" },
      { days: "Saturday", time: "09:00 AM – 01:00 PM (By Appointment)" },
      { days: "Sunday", time: "Emergency Coverage Only" },
    ],
  },
  socialLinks: [
    { platform: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov", handle: "Elena-Vance-MD" },
    { platform: "Doximity", url: "https://doximity.com", handle: "drelenavance" },
    { platform: "ResearchGate", url: "https://researchgate.net", handle: "Elena_Vance_MD" },
    { platform: "LinkedIn", url: "https://linkedin.com", handle: "in/dr-elena-vance-md" },
  ],
};


export default doctorProfile;
