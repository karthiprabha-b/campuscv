import { PortfolioData } from '../types/portfolio';
import { adminTemplateDb } from './adminTemplateDb';
import { isUploadedPortfolio } from './templateResolver';
import { bindProfileToTemplate } from './templateBinder';
import { CampusProfile, createEmptyCanonicalProfile, normalizeToCanonicalProfile } from '../types/canonicalProfile';
import { toUniversalCanonicalProfile } from '../lib/binding/BindingSchema';

/**
 * portfolioNormalizer.ts — Canonical Profile Normalizer & Universal Binder
 *
 * Single Source of Truth Architecture:
 * Canonical CampusProfile -> Universal Template Binder -> Rendered Template Props
 *
 * ABSOLUTELY NO FAKE DEMO DATA IN REAL MODE (No Anna University, No Adaptive Systems, No Tech Innovators).
 */

const SAFE_AVATAR_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" fill="none"><rect width="600" height="800" fill="#F3F4F6"/><circle cx="300" cy="320" r="140" fill="#9CA3AF"/><path d="M120 720C120 540 200 480 300 480C400 480 480 540 480 720" fill="#9CA3AF"/></svg>`
)}`;

export function resolveDeterministicProfileImage(portfolio: any, templateDemoImage: string = ''): string {
  if (!portfolio || typeof portfolio !== 'object') return SAFE_AVATAR_PLACEHOLDER;

  // Priority 1: Explicit Node Overrides (contentOverrides & imageOverrides)
  const overrideCandidate =
    portfolio.contentOverrides?.['image:about:root:img:0']?.src ||
    (typeof portfolio.contentOverrides?.['image:about:root:img:0'] === 'string' ? portfolio.contentOverrides?.['image:about:root:img:0'] : null) ||
    portfolio.contentOverrides?.['image:hero:root:img:0']?.src ||
    (typeof portfolio.contentOverrides?.['image:hero:root:img:0'] === 'string' ? portfolio.contentOverrides?.['image:hero:root:img:0'] : null) ||
    portfolio.contentOverrides?.['about.avatarUrl']?.src ||
    (typeof portfolio.contentOverrides?.['about.avatarUrl'] === 'string' ? portfolio.contentOverrides?.['about.avatarUrl'] : null) ||
    portfolio.imageOverrides?.['image:about:root:img:0'] ||
    portfolio.imageOverrides?.['image:hero:root:img:0'] ||
    portfolio.imageOverrides?.['about.avatarUrl'] ||
    Object.entries(portfolio.contentOverrides || {}).find(([k, v]: any) => (k.includes('avatar') || k.includes('profile') || k.includes('portrait') || k.includes('hero') || k.includes('about')) && k.includes('img') && (v?.src || typeof v === 'string'))?.[1] ||
    Object.entries(portfolio.imageOverrides || {}).find(([k, v]: any) => (k.includes('avatar') || k.includes('profile') || k.includes('portrait') || k.includes('hero') || k.includes('about')) && typeof v === 'string')?.[1];

  const explicitSrc = typeof overrideCandidate === 'object' && overrideCandidate !== null ? (overrideCandidate.src || overrideCandidate.value) : overrideCandidate;

  if (typeof explicitSrc === 'string' && explicitSrc.trim().length > 0) {
    return explicitSrc.trim();
  }

  const candidate =
    portfolio.profileImage ||
    portfolio.avatar ||
    portfolio.photo ||
    portfolio.image ||
    portfolio.avatarUrl ||
    portfolio.personal?.profilePhoto ||
    portfolio.personal?.avatarUrl ||
    portfolio.profile?.profileImage ||
    portfolio.profile?.avatarUrl ||
    portfolio.profile?.photo ||
    portfolio.profile?.image ||
    portfolio.hero?.avatarUrl ||
    portfolio.hero?.profileImage ||
    portfolio.about?.avatarUrl ||
    portfolio.about?.image ||
    portfolio.images?.profileImage;

  if (typeof candidate === 'string' && candidate.trim().length > 0) {
    return candidate.trim();
  }

  return SAFE_AVATAR_PLACEHOLDER;
}

export function cleanBioParagraph(text: string): string {
  if (!text || typeof text !== 'string') return '';
  const trimmed = text.trim();
  if (!trimmed) return '';

  const rawSentences = trimmed.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
  const uniqueSentences: string[] = [];
  const seen = new Set<string>();

  for (const sent of rawSentences) {
    const normalized = sent.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normalized.length > 5 && !seen.has(normalized)) {
      seen.add(normalized);
      uniqueSentences.push(sent);
    }
  }

  // Keep at most 2-3 concise sentences (under ~45 words) for a clean, punchy bio paragraph
  const conciseSentences = uniqueSentences.slice(0, 3);
  return conciseSentences.join(' ').trim();
}

export function normalizePortfolio(raw: any): PortfolioData {
  if (!raw || typeof raw !== 'object') return raw;

  const isUploaded = isUploadedPortfolio(raw);
  const renderMode = raw.renderMode || raw.mode || 'EDITOR';

  // Deterministic profile image resolution (Priority 1..6)
  const resolvedImg = resolveDeterministicProfileImage(raw, '');

  console.log('[CV DEBUG][NORMALIZE BEFORE]', {
    portfolioId: raw?.id,
    renderMode,
    rawTopKeys: Object.keys(raw || {}),
    imageCandidates: {
      profileImage: raw?.profileImage,
      avatarUrl: raw?.avatarUrl,
      avatar: raw?.avatar,
      photo: raw?.photo,
      image: raw?.image,
      personalProfilePhoto: raw?.personal?.profilePhoto,
      canonicalPersonalProfilePhoto: raw?.canonicalProfile?.personal?.profilePhoto,
      aboutAvatarUrl: raw?.about?.avatarUrl,
      heroAvatarUrl: raw?.hero?.avatarUrl
    },
    resolvedImageUrl: resolvedImg
  });

  // 1. Resolve or construct Canonical Profile from payload
  let canonicalProfile: CampusProfile;
  if (raw.canonicalProfile && typeof raw.canonicalProfile === 'object') {
    canonicalProfile = normalizeToCanonicalProfile(raw.canonicalProfile, raw.id, raw.username);
  } else {
    canonicalProfile = normalizeToCanonicalProfile(raw, raw.id, raw.username);
  }
  if (resolvedImg) {
    canonicalProfile.personal.profilePhoto = resolvedImg;
  }

  // 2. Bind Canonical Profile to Template Props via Universal Binding Engine
  const boundProps = bindProfileToTemplate(canonicalProfile, {
    renderMode,
    templateId: raw.templateId || raw.layoutStyle || 'default',
    templateOverrides: raw.templateOverrides,
    contentOverrides: raw.contentOverrides
  });

  const emailVal = raw.email || raw.ownerEmail || raw.personal?.email || raw.profile?.email || canonicalProfile.personal?.email || '';

  const mergedSocials = {
    linkedin: raw.socials?.linkedin || raw.socialLinks?.linkedin || raw.social?.linkedin || canonicalProfile.social?.linkedin || '',
    dribbble: raw.socials?.dribbble || raw.socialLinks?.dribbble || raw.social?.dribbble || (canonicalProfile.social as any)?.dribbble || '',
    behance: raw.socials?.behance || raw.socialLinks?.behance || raw.social?.behance || (canonicalProfile.social as any)?.behance || '',
    github: raw.socials?.github || raw.socialLinks?.github || raw.social?.github || canonicalProfile.social?.github || '',
    instagram: raw.socials?.instagram || raw.socialLinks?.instagram || raw.social?.instagram || (canonicalProfile.social as any)?.instagram || '',
    twitter: raw.socials?.twitter || raw.socials?.x || raw.socialLinks?.twitter || raw.socialLinks?.x || raw.social?.twitter || raw.social?.x || canonicalProfile.social?.twitter || '',
    website: raw.socials?.website || raw.socials?.url || raw.socialLinks?.website || raw.socialLinks?.url || raw.social?.website || (canonicalProfile.social as any)?.website || '',
    ...(typeof raw.socials === 'object' ? raw.socials : {}),
    ...(typeof raw.socialLinks === 'object' ? raw.socialLinks : {}),
    ...(typeof raw.social === 'object' ? raw.social : {})
  };

  // 3. Auto-restore template package assets if missing from payload
  let sectionFiles = raw.sectionFiles;
  let templateCode = raw.templateCode;
  let customCSS = raw.customCSS;
  let bindings = raw.bindings;
  let schema = raw.schema;
  let assetMap = raw.assetMap;

  if ((!sectionFiles || Object.keys(sectionFiles).length === 0) && (raw.templateId || raw.layoutStyle)) {
    const tmplId = raw.templateId || raw.layoutStyle;
    if (typeof window !== 'undefined') {
      try {
        const adminTmpl = adminTemplateDb.getTemplateById(tmplId);
        if (adminTmpl) {
          sectionFiles = adminTmpl.sectionFiles || sectionFiles;
          templateCode = adminTmpl.templateCode || templateCode;
          customCSS = adminTmpl.customCSS || customCSS;
          bindings = (adminTmpl as any).bindings || bindings;
          schema = (adminTmpl as any).schema || schema;
          assetMap = (adminTmpl as any).assetMap || assetMap;
        }
      } catch {}
    }
  }

    // Helper to check if a skills list is strictly the initial demo/seed list
    const isDemoSkillList = (arr: any[]) => {
      if (!Array.isArray(arr) || arr.length === 0) return true;
      const demoKeywords = ['react / next.js', 'typescript', 'html5 & css3', 'tailwind css', 'node.js & express', 'sql & mongodb', 'rest apis', 'figma (auto-layout', 'adobe creative suite', 'prototyping & wireframing'];
      let flat: string[] = [];
      arr.forEach(item => {
        if (typeof item === 'string') flat.push(item.toLowerCase());
        else if (item && typeof item === 'object') {
          if (Array.isArray(item.items)) {
            item.items.forEach((it: any) => flat.push((it.name || it || '').toLowerCase()));
          } else {
            flat.push((item.name || item.title || item.skill || '').toLowerCase());
          }
        }
      });
      if (flat.length === 0) return true;
      return flat.every(s => demoKeywords.some(d => s.includes(d) || d.includes(s)));
    };

    const isExactDemoCertTitle = (title: string) => {
      const t = (title || '').toLowerCase().trim();
      return (
        t.includes('google ux design') ||
        t.includes('typescript enterprise') ||
        t.includes('full-stack web engineering boot camp') ||
        t.includes('advanced react & next.js') ||
        t === 'professional certification'
      );
    };

    const resolvedSkills = (() => {
      const canonicalSkills = Array.isArray(canonicalProfile.skills) ? canonicalProfile.skills : [];
      if (canonicalSkills.length > 0 && isDemoSkillList(raw.skills)) {
        return canonicalSkills;
      }
      if (Array.isArray(raw.skills) && raw.skills.length > 0) {
        return raw.skills;
      }
      return boundProps.skills !== undefined ? boundProps.skills : canonicalSkills;
    })();

    const resolvedCertifications = (() => {
      const candidateList = Array.isArray(raw.certifications) && raw.certifications.length > 0
        ? raw.certifications
        : (Array.isArray(raw.awards) && raw.awards.length > 0
            ? raw.awards
            : (boundProps.certifications !== undefined ? boundProps.certifications : (canonicalProfile.certifications || [])));
      
      if (Array.isArray(candidateList) && candidateList.length > 0) {
        const hasReal = candidateList.some((c: any) => !isExactDemoCertTitle(c.title || c.name || ''));
        if (hasReal) {
          return candidateList.filter((c: any) => !isExactDemoCertTitle(c.title || c.name || ''));
        }
      }
      return candidateList;
    })();

    const resolvedLocation = boundProps.location || raw.location || [canonicalProfile.personal?.city, canonicalProfile.personal?.state, canonicalProfile.personal?.country].filter(Boolean).join(', ') || raw.personal?.location || raw.profile?.location || '';

    const rawSummary = boundProps.aboutMe || raw.aboutMe || canonicalProfile.personal?.summary || raw.profile?.summary || raw.profile?.bio || raw.summary || '';
    const cleanSummary = cleanBioParagraph(rawSummary);

    const normalizedObj: PortfolioData = {
      ...raw,
      ...boundProps,
      name: boundProps.name || raw.name,
      fullName: boundProps.fullName || raw.fullName,
      headline: boundProps.headline || raw.headline,
      role: boundProps.role || raw.role,
      location: resolvedLocation,
      profileImage: resolvedImg || boundProps.profileImage || raw.profileImage,
      avatarUrl: resolvedImg || boundProps.avatarUrl || raw.avatarUrl,
      avatar: resolvedImg,
      photo: resolvedImg,
      image: resolvedImg,
      email: emailVal,
      aboutMe: cleanSummary,
      hero: {
        name: raw.hero?.name || boundProps.name || raw.name || canonicalProfile.personal?.fullName || '',
        role: raw.hero?.role || boundProps.role || raw.role || canonicalProfile.personal?.headline || '',
        title: raw.hero?.title || raw.tagline || raw.headline || boundProps.headline || canonicalProfile.personal?.headline || '',
        subtitle: raw.hero?.subtitle || raw.tagline || boundProps.headline || canonicalProfile.personal?.headline || '',
        description: cleanBioParagraph(raw.hero?.description || cleanSummary),
        introductionText: cleanBioParagraph(raw.hero?.introductionText || cleanSummary),
        degree: raw.hero?.degree || raw.university || (canonicalProfile.education?.[0] ? `${canonicalProfile.education[0].degree || ''} at ${canonicalProfile.education[0].institution || (canonicalProfile.education[0] as any).school || ''}`.trim() : ''),
        university: raw.hero?.university || raw.university || (canonicalProfile.education?.[0]?.institution || (canonicalProfile.education?.[0] as any)?.school || ''),
        location: raw.hero?.location || resolvedLocation,
        graduation: raw.hero?.graduation || raw.graduation || ((canonicalProfile.education?.[0] as any)?.year || (canonicalProfile.education?.[0] as any)?.period || ''),
        ...(raw.hero || {}),
        ...(boundProps.hero || {}),
        avatarUrl: resolvedImg || raw.hero?.avatarUrl || boundProps.hero?.avatarUrl,
        profileImage: resolvedImg || raw.hero?.profileImage || boundProps.hero?.profileImage,
        image: resolvedImg,
        photo: resolvedImg
      },
      about: {
        ...(raw.about || {}),
        ...(boundProps.about || {}),
        description: cleanBioParagraph(raw.about?.description || cleanSummary),
        bio: cleanBioParagraph(raw.about?.bio || cleanSummary),
        avatarUrl: resolvedImg || raw.about?.avatarUrl || boundProps.about?.avatarUrl,
        profileImage: resolvedImg || raw.about?.profileImage || boundProps.about?.profileImage,
        image: resolvedImg,
        photo: resolvedImg
      },
      projects: Array.isArray(raw.projects) ? raw.projects : (boundProps.projects !== undefined ? boundProps.projects : []),
      experience: Array.isArray(raw.experience) ? raw.experience : (boundProps.experience !== undefined ? boundProps.experience : []),
      skills: resolvedSkills,
      education: (Array.isArray(raw.education) && raw.education.length > 0 ? raw.education : (canonicalProfile.education || boundProps.education || [])).map((edu: any, idx: number) => {
        const start = (edu.startDate || edu.startYear || edu.start || edu.from || '').toString().trim();
        const end = (edu.endDate || edu.endYear || edu.end || edu.to || edu.graduationYear || edu.graduation || '').toString().trim();
        const period = (edu.period || edu.duration || edu.years || edu.year || (start && end ? `${start} – ${end}` : (start || end || ''))).toString().trim();
        const field = (edu.fieldOfStudy || edu.field || edu.department || edu.specialization || edu.major || '').toString().trim();
        const inst = (edu.institution || edu.school || edu.university || edu.college || '').toString().trim();
        const deg = (edu.degree || edu.title || edu.qualification || '').toString().trim();
        return {
          ...edu,
          id: edu.id || `edu-${idx + 1}`,
          degree: deg,
          institution: inst,
          school: inst,
          university: inst,
          startDate: start,
          endDate: end,
          startYear: start,
          endYear: end,
          period,
          duration: period,
          year: period,
          years: period,
          fieldOfStudy: field,
          field,
          department: field,
          specialization: field
        };
      }),
      certifications: resolvedCertifications,
      services: Array.isArray(raw.services) ? raw.services : (boundProps.services !== undefined ? boundProps.services : []),
      testimonials: Array.isArray(raw.testimonials) ? raw.testimonials : (boundProps.testimonials !== undefined ? boundProps.testimonials : []),
      personal: {
        name: boundProps.name || raw.name || raw.personal?.name || canonicalProfile.personal?.fullName || '',
        fullName: boundProps.fullName || raw.fullName || raw.personal?.fullName || canonicalProfile.personal?.fullName || '',
        role: boundProps.role || raw.role || raw.headline || raw.personal?.headline || canonicalProfile.personal?.headline || '',
        headline: boundProps.headline || raw.headline || raw.personal?.headline || canonicalProfile.personal?.headline || '',
        location: resolvedLocation,
        email: emailVal,
        phone: raw.phone || canonicalProfile.personal?.phone || '',
        profilePhoto: resolvedImg,
        avatarUrl: resolvedImg,
        summary: cleanSummary,
        availability: raw.personal?.availability || ''
      },
      profile: {
        name: boundProps.name || raw.name || raw.profile?.name || '',
        fullName: boundProps.fullName || raw.fullName || raw.profile?.fullName || '',
        headline: boundProps.headline || raw.headline || raw.profile?.headline || '',
        role: boundProps.headline || raw.headline || raw.profile?.role || raw.profile?.headline || '',
        summary: cleanSummary,
        bio: cleanSummary,
        about: cleanSummary,
        location: resolvedLocation,
        email: emailVal,
        phone: raw.phone || raw.profile?.phone || '',
        avatarUrl: resolvedImg,
        photo: resolvedImg,
        image: resolvedImg,
        profileImage: resolvedImg,
        avatar: resolvedImg
      },
      contact: {
        email: emailVal,
        phone: raw.phone || raw.personal?.phone || raw.profile?.phone || canonicalProfile.personal?.phone || '',
        location: resolvedLocation,
        socials: mergedSocials
      },
      socials: mergedSocials,
      socialLinks: mergedSocials,
      social: mergedSocials,
      images: raw.images || {
        profileImage: resolvedImg,
        projects: (boundProps.projects || []).map((p: any) => p.imageUrl || p.image).filter(Boolean)
      },
      resume: raw.resume || canonicalProfile.resume || null,
      canonicalProfile,
      universalCanonicalProfile: toUniversalCanonicalProfile(raw),
      renderMode,
      mode: renderMode,
      id: raw.id || 'default-id',
      username: raw.username || '',
      templateId: raw.templateId || raw.layoutStyle || 'default',
      templateType: isUploaded ? 'uploaded' : (raw.templateType || 'built-in'),
      category: raw.category || 'Portfolio',
      published: !!raw.published,
      dataVersion: raw.dataVersion !== undefined ? raw.dataVersion : (raw._dataVersion || 1),

      // Explicitly preserve top-level editor states and customization:
      sectionOrder: Array.isArray(raw.sectionOrder) && raw.sectionOrder.length > 0 ? raw.sectionOrder : (Array.isArray(raw.section_order) && raw.section_order.length > 0 ? raw.section_order : (Array.isArray(raw.sections) && raw.sections.length > 0 ? raw.sections : undefined)),
      sections: Array.isArray(raw.sections) && raw.sections.length > 0 ? raw.sections : (Array.isArray(raw.sectionOrder) && raw.sectionOrder.length > 0 ? raw.sectionOrder : undefined),
      deletedNodes: raw.deletedNodes || {},
      hiddenNodes: raw.hiddenNodes || {},
      hiddenFields: Array.isArray(raw.hiddenFields) ? raw.hiddenFields : [],
      hiddenSections: Array.isArray(raw.hiddenSections) ? raw.hiddenSections : [],
      styleOverrides: raw.styleOverrides || {},
      theme: raw.theme,
      themeColor: raw.themeColor || raw.theme?.primaryColor || raw.theme?.accentColor || raw.accentColor || raw.userSelectedAccent,
      accentColor: raw.accentColor || raw.themeColor || raw.userSelectedAccent,
      userSelectedAccent: raw.userSelectedAccent || raw.themeColor || raw.accentColor,
      userSelectedFont: raw.userSelectedFont || raw.fontPack || raw.typography?.fontFamily,
      userSelectedFontSize: raw.userSelectedFontSize || raw.baseFontSize || raw.typography?.fontSize,
      typography: raw.typography,
      fontPack: raw.fontPack,
      baseFontSize: raw.baseFontSize,

      sectionFiles,
      templateCode,
      customCSS,
      bindings,
      schema,
      assetMap
  };

  console.log('[CV DEBUG][STAGE D: NORMALIZATION]', {
    stage: 'PORTFOLIO NORMALIZATION',
    portfolioId: raw.id,
    templateId: raw.templateId || raw.layoutStyle,
    renderMode,
    name: canonicalProfile.personal?.fullName,
    profileImage: resolvedImg || raw.profileImage,
    email: emailVal,
    linkedin: mergedSocials.linkedin,
    experienceCount: canonicalProfile.experience?.length,
    educationCount: canonicalProfile.education?.length,
    projectsCount: Array.isArray(canonicalProfile.projects) ? canonicalProfile.projects.length : (canonicalProfile.projects === undefined ? 'undefined' : 0),
    skillsCount: canonicalProfile.skills?.length,
    timestamp: new Date().toISOString()
  });

  return normalizedObj;
}
