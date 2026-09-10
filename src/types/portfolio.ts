export interface ElementStyle {
  fontSize?: number;
  fontWeight?: string;
  letterSpacing?: number;
  lineHeight?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderStyle?: string;
  width?: number;
  height?: number;
  xPosition?: number;
  yPosition?: number;
  rotation?: number;
  scale?: number;
  opacity?: number;
  zIndex?: number;
  animation?: string;
  hideDesktop?: boolean;
  hideTablet?: boolean;
  hideMobile?: boolean;
  
  // Custom advanced design overrides
  containerWidth?: number;
  sectionWidth?: number;
  gridColumns?: number;
  sidebarPosition?: string;
  heroLayout?: string;
  sectionOrder?: string;
  fontFamily?: string;
  gapBetweenElements?: number;
  sectionSpacing?: number;
  shadowIntensity?: number;
  glassEffect?: boolean;
  blurEffect?: number;
  hoverAnimation?: string;
  scrollAnimation?: string;
  revealAnimation?: string;
  loadingAnimation?: string;
  lockElement?: boolean;
  hideElement?: boolean;
}

export interface StatItem {
  label: string;
  value: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  date: string;
}

export interface TimelineItem {
  title: string;
  subtitle: string;
  desc: string;
}

export interface ProjectItem {
  title: string;
  desc: string;
  tags: string[];
  link?: string;
}

export interface BlogItem {
  title: string;
  date: string;
  readTime: string;
  desc: string;
}

export interface TestimonialItem {
  author: string;
  role: string;
  quote: string;
}

export interface GalleryItem {
  title: string;
  type: string;
  path: string;
}

export interface ServiceItem {
  title: string;
  desc: string;
  icon: string;
}

export interface AwardItem {
  title: string;
  issuer: string;
  date: string;
}

export interface PublicationItem {
  title: string;
  publisher: string;
  date: string;
  link?: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
}

export interface MetaData {
  portfolioTitle: string;
  seoTitle: string;
  slug: string;
  description?: string;
  keywords?: string;
}

export interface NavigationData {
  brandName: string;
  logoUrl?: string;
  links?: { label: string; href: string }[];
}

export interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  avatarUrl?: string;
  badgeText?: string;
}

export interface ProfileData {
  name?: string;
  fullName?: string;
  headline?: string;
  summary?: string;
  about?: string;
  location?: string;
  email?: string;
  phone?: string;
  photo?: string;
  avatarUrl?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface AboutData {
  title: string;
  subtitle?: string;
  description: string;
  bio?: string;
  avatarUrl?: string;
}

export interface PortfolioData {
  id: string;
  _lastUpdated?: number;
  username: string;
  ownerEmail?: string;
  category: string;
  templateId?: string;
  templateVersionId?: string;
  templateCode?: string;
  sectionFiles?: Record<string, string>;
  customCSS?: string;
  bindings?: any;
  schema?: any;
  assetMap?: Record<string, string>;
  templateOverrides?: Record<string, any>;
  contentOverrides?: Record<string, any>;
  styleOverrides?: Record<string, any>;
  imageOverrides?: Record<string, any>;
  deletedNodes?: Record<string, boolean>;
  sectionOrder?: string[];
  addedElements?: any[];
  _sectionFilesTemplateId?: string;
  templateType?: string;
  meta?: MetaData;
  navigation?: NavigationData;
  hero?: HeroData;
  profile?: ProfileData;
  about?: AboutData;
  title: string;
  name: string;
  tagline: string;
  profileImage: string;
  avatarUrl?: string;
  projectThumbnail: string;
  themeColor: string;
  fontPack: string;
  userSelectedAccent?: boolean;
  userSelectedFont?: boolean;
  userSelectedFontSize?: boolean;
  isDarkMode: boolean;
  stats: StatItem[];
  skills: any[];
  certifications: CertificationItem[];
  timeline: TimelineItem[];
  experience?: any[];
  education?: any[];
  projects: any[];
  socials?: any;
  images?: any;
  resume?: any;
  aboutMe?: string;
  university?: string;
  major?: string;
  hiddenFields?: string[];
  company?: string;
  role?: string;
  specialty?: string;
  industry?: string;
  niche?: string;
  published: boolean;
  customDomain?: string;
  seo: SEOData;
  sections: string[];
  enabledPages?: string[];
  blogs?: BlogItem[];
  testimonials?: TestimonialItem[];
  gallery?: GalleryItem[];
  services?: ServiceItem[];
  awards?: AwardItem[];
  publications?: PublicationItem[];
  socialLinks?: SocialLinks;
  layoutStyle?: string;
  spacingPreset?: string;
  sectionGap?: number;
  cardBorderRadius?: number;
  contentPadding?: number;
  animationPreset?: string;
  enableScrollAnimation?: boolean;
  enableHoverEffects?: boolean;
  advancedSettings?: Record<string, ElementStyle>;
  heroIntro?: string;
  aboutHeading?: string;
  skillsHeading?: string;
  projectsHeading?: string;
  timelineHeading?: string;
  contactHeading?: string;
  certificationsHeading?: string;
  blogsHeading?: string;
  galleryHeading?: string;
  testimonialsHeading?: string;
  servicesHeading?: string;
  awardsHeading?: string;
  publicationsHeading?: string;
  baseFontSize?: number;
  theme?: {
    primaryColor: string;
    secondaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
  typography?: {
    fontFamily: string;
    fontSize?: number;
  };
  button?: {
    primary?: {
      background?: string;
      textColor?: string;
      radius?: string;
    };
  };
  lastSaved?: number;
  lastPublished?: number;
}
