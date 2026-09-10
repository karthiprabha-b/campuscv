/**
 * templateLibraryAdapters.ts — Universal Animation & UI Library Adapters
 *
 * Provides module resolution and runtime adapters for popular third-party animation libraries
 * imported by uploaded templates: GSAP, ScrollTrigger, AOS, Swiper, Lenis, Locomotive Scroll,
 * Three.js, Anime.js, Lottie, Typed.js, Canvas-Confetti, Chart.js, clsx, and tailwind-merge.
 */

import React from 'react';

// Simple clsx implementation
export function clsx(...inputs: any[]): string {
  return inputs
    .flatMap((x) => {
      if (!x) return [];
      if (typeof x === 'string' || typeof x === 'number') return [String(x)];
      if (Array.isArray(x)) return [clsx(...x)];
      if (typeof x === 'object') {
        return Object.entries(x)
          .filter(([, v]) => Boolean(v))
          .map(([k]) => k);
      }
      return [];
    })
    .filter(Boolean)
    .join(' ');
}

// Simple twMerge implementation
export function twMerge(...inputs: any[]): string {
  return clsx(...inputs);
}

// ── GSAP & SCROLLTRIGGER ADAPTER ──────────────────────────────────────────────
export const createGsapAdapter = () => {
  const win = typeof window !== 'undefined' ? (window as any) : {};
  if (win.gsap) return win.gsap;

  const stubAnimation = {
    to: () => stubAnimation,
    from: () => stubAnimation,
    fromTo: () => stubAnimation,
    play: () => stubAnimation,
    pause: () => stubAnimation,
    reverse: () => stubAnimation,
    kill: () => stubAnimation,
    restart: () => stubAnimation,
    scrollTrigger: null
  };

  const gsapStub: any = {
    to: (target: any, vars: any) => stubAnimation,
    from: (target: any, vars: any) => stubAnimation,
    fromTo: (target: any, fromVars: any, toVars: any) => stubAnimation,
    set: (target: any, vars: any) => stubAnimation,
    timeline: (vars?: any) => stubAnimation,
    registerPlugin: (...plugins: any[]) => {},
    context: (func: Function, scope?: any) => {
      if (typeof func === 'function') {
        try { func(); } catch (e) {}
      }
      return { revert: () => {}, kill: () => {} };
    },
    matchMedia: () => ({ add: () => {}, revert: () => {} }),
    defaults: (vars: any) => {},
    config: (vars: any) => {},
    globalTimeline: stubAnimation,
    ticker: { add: () => {}, remove: () => {} },
    utils: {
      toArray: (selector: any) => {
        if (typeof document === 'undefined') return [];
        if (typeof selector === 'string') return Array.from(document.querySelectorAll(selector));
        if (Array.isArray(selector)) return selector;
        return selector ? [selector] : [];
      },
      clamp: (min: number, max: number, val: number) => Math.min(Math.max(val, min), max),
      mapRange: (inMin: number, inMax: number, outMin: number, outMax: number, value: number) => {
        return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
      },
      random: (min: number, max: number) => Math.random() * (max - min) + min
    }
  };

  return gsapStub;
};

export const createScrollTriggerAdapter = () => {
  const win = typeof window !== 'undefined' ? (window as any) : {};
  if (win.ScrollTrigger) return win.ScrollTrigger;

  return {
    create: (vars: any) => ({ kill: () => {}, refresh: () => {}, update: () => {} }),
    refresh: () => {},
    update: () => {},
    matchMedia: () => ({ add: () => {}, revert: () => {} }),
    getAll: () => [],
    getById: () => null,
    config: () => {},
    scrollerProxy: () => {},
    addEventListener: () => {},
    removeEventListener: () => {}
  };
};

// ── AOS (ANIMATE ON SCROLL) ADAPTER ──────────────────────────────────────────
export const createAosAdapter = () => {
  const win = typeof window !== 'undefined' ? (window as any) : {};
  if (win.AOS) return win.AOS;

  return {
    init: (options?: any) => {
      console.log('[TEMPLATE LIBRARY ADAPTER] AOS initialized with options:', options);
    },
    refresh: () => {},
    refreshHard: () => {}
  };
};

// ── SWIPER REACT ADAPTER ─────────────────────────────────────────────────────
export const createSwiperReactAdapter = () => {
  const Swiper = React.forwardRef(({ children, className, style, ...props }: any, ref: any) => {
    return React.createElement(
      'div',
      { ref, className: `swiper-container ${className || ''}`, style, ...props },
      React.createElement('div', { className: 'swiper-wrapper' }, children)
    );
  });
  Swiper.displayName = 'Swiper';

  const SwiperSlide = React.forwardRef(({ children, className, style, ...props }: any, ref: any) => {
    return React.createElement('div', { ref, className: `swiper-slide ${className || ''}`, style, ...props }, children);
  });
  SwiperSlide.displayName = 'SwiperSlide';

  return {
    Swiper,
    SwiperSlide,
    useSwiper: () => ({ slideNext: () => {}, slidePrev: () => {}, slideTo: () => {} }),
    useSwiperSlide: () => ({ isActive: true, isVisible: true, isNext: false, isPrev: false })
  };
};

// ── LENIS SMOOTH SCROLL ADAPTER ──────────────────────────────────────────────
export const createLenisAdapter = () => {
  class LenisStub {
    options: any;
    constructor(options?: any) {
      this.options = options;
    }
    on(event: string, callback: Function) {}
    off(event: string, callback: Function) {}
    raf(time: number) {}
    scrollTo(target: any, options?: any) {}
    start() {}
    stop() {}
    destroy() {}
  }
  return LenisStub;
};

// ── MASTER LIBRARY MODULE RESOLVER ──────────────────────────────────────────
export function resolveTemplateLibrary(importPath: string): any | null {
  const cleanPath = importPath.trim().toLowerCase();

  // 1. Classname Utilities
  if (cleanPath === 'clsx') {
    return { clsx, default: clsx };
  }
  if (cleanPath === 'tailwind-merge') {
    return { twMerge, default: twMerge };
  }

  // 2. GSAP & Plugins
  if (cleanPath === 'gsap') {
    const gsap = createGsapAdapter();
    return { gsap, default: gsap, ...gsap };
  }
  if (cleanPath === 'gsap/scrolltrigger') {
    const ScrollTrigger = createScrollTriggerAdapter();
    return { ScrollTrigger, default: ScrollTrigger };
  }
  if (cleanPath === 'gsap/scrolltoplugin' || cleanPath === 'gsap/flip' || cleanPath === 'gsap/customease') {
    return { default: {} };
  }

  // 3. AOS (Animate On Scroll)
  if (cleanPath === 'aos') {
    const AOS = createAosAdapter();
    return { AOS, default: AOS };
  }

  // 4. Swiper & Swiper/React
  if (cleanPath === 'swiper/react') {
    const swiperReact = createSwiperReactAdapter();
    return { ...swiperReact, default: swiperReact.Swiper };
  }
  if (cleanPath === 'swiper' || cleanPath.startsWith('swiper/')) {
    return {
      default: class SwiperCore { constructor() {} },
      Navigation: {},
      Pagination: {},
      Autoplay: {},
      EffectFade: {},
      EffectCube: {},
      EffectCoverflow: {},
      EffectFlip: {}
    };
  }

  // 5. Lenis & Locomotive Scroll
  if (cleanPath === 'lenis' || cleanPath === '@studio-freight/lenis') {
    const Lenis = createLenisAdapter();
    return { Lenis, default: Lenis };
  }
  if (cleanPath === 'locomotive-scroll') {
    class LocomotiveScroll { constructor() {} destroy() {} update() {} }
    return { default: LocomotiveScroll };
  }

  // 6. Three.js, Anime.js, Lottie, Typed.js, Canvas-Confetti, Chart.js
  if (cleanPath === 'three') {
    return { Scene: class {}, PerspectiveCamera: class {}, WebGLRenderer: class { render() {} setSize() {} } };
  }
  if (cleanPath === 'animejs' || cleanPath === 'animejs/lib/anime.es.js') {
    const anime = (opts: any) => ({ play: () => {}, pause: () => {}, restart: () => {} });
    return { anime, default: anime };
  }
  if (cleanPath === 'lottie-web') {
    return { loadAnimation: () => ({ play: () => {}, stop: () => {}, destroy: () => {} }) };
  }
  if (cleanPath === 'typed.js') {
    class Typed { constructor() {} destroy() {} reset() {} }
    return { default: Typed };
  }
  if (cleanPath === 'canvas-confetti') {
    const confetti = () => {};
    return { confetti, default: confetti };
  }

  return null;
}
