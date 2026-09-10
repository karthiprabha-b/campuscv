/**
 * CampusCV Template Runtime (template.js)
 * Enables generic, safe, non-destructive content binding & live-editing in CampusCV.
 */

(function () {
  'use strict';

  class CampusCVRuntime {
    constructor() {
      this.manifest = null;
      this.data = {};
      this.init();
    }

    async init() {
      // Attempt to load campuscv.json manifest if present
      try {
        const response = await fetch('./campuscv.json');
        if (response.ok) {
          this.manifest = await response.json();
        }
      } catch (err) {
        console.warn('[CampusCV] Manifest loading skipped or running standalone.');
      }

      // Expose globally for CampusCV Editor / Admin preview window
      window.CampusCV = {
        updateField: this.updateField.bind(this),
        updateThemeToken: this.updateThemeToken.bind(this),
        setSectionVisibility: this.setSectionVisibility.bind(this),
        setData: this.setData.bind(this),
        getData: () => this.data,
        getManifest: () => this.manifest
      };

      // Dispatch event signaling template runtime ready
      window.dispatchEvent(new CustomEvent('campuscv:ready', { detail: window.CampusCV }));
    }

    /**
     * Set full portfolio dataset and update DOM elements safely
     */
    setData(newData) {
      this.data = { ...this.data, ...newData };
      this.render();
    }

    /**
     * Update a single field by path (e.g. "hero.headline", "doctor.name")
     */
    updateField(path, value) {
      this.setPathValue(this.data, path, value);
      const elements = document.querySelectorAll(`[data-cv="${path}"]`);
      
      elements.forEach(el => {
        this.applyValueToElement(el, value, path);
      });
    }

    /**
     * Update CSS theme variables safely
     */
    updateThemeToken(tokenName, value) {
      if (!tokenName || !value) return;

      const normToken = String(tokenName).toLowerCase();
      if (normToken.includes('accent') || normToken.includes('color') || normToken.includes('primary')) {
        document.documentElement.style.setProperty('--campuscv-accent', value);
        document.documentElement.style.setProperty('--cv-accent', value);
        document.documentElement.style.setProperty('--primary', value);
        document.documentElement.style.setProperty('--accent', value);
        document.documentElement.style.setProperty('--brand', value);
      } else if (normToken.includes('font') && !normToken.includes('size')) {
        document.documentElement.style.setProperty('--campuscv-font-family', value);
        document.documentElement.style.setProperty('--font-body', value);
      } else if (normToken.includes('size')) {
        const pxVal = typeof value === 'number' ? `${value}px` : value;
        document.documentElement.style.setProperty('--campuscv-base-font-size', pxVal);
      } else {
        document.documentElement.style.setProperty(`--campuscv-${tokenName}`, value);
        document.documentElement.style.setProperty(`--cv-${tokenName}`, value);
      }
    }

    /**
     * Toggle visibility of a section without destroying its layout
     */
    setSectionVisibility(sectionId, isVisible) {
      const sectionEl = document.querySelector(`[data-cv-section="${sectionId}"]`) || document.getElementById(sectionId);
      if (sectionEl) {
        sectionEl.style.display = isVisible ? '' : 'none';
      }
    }

    applyValueToElement(el, value, path) {
      if (!el) return;

      const tag = el.tagName.toLowerCase();

      if (tag === 'img') {
        if (typeof value === 'string') {
          el.src = value;
        } else if (value && value.src) {
          el.src = value.src;
          if (value.alt !== undefined) el.alt = value.alt;
        }
      } else if (tag === 'a') {
        if (typeof value === 'string') {
          el.textContent = value;
        } else if (value && typeof value === 'object') {
          if (value.label !== undefined) el.textContent = value.label;
          if (value.url !== undefined) el.href = value.url;
        }
      } else if (tag === 'input' || tag === 'textarea') {
        el.value = value || '';
      } else {
        el.textContent = typeof value === 'object' ? (value.label || value.name || JSON.stringify(value)) : value;
      }
    }

    setPathValue(obj, path, value) {
      const parts = path.split('.');
      let curr = obj;
      for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i];
        if (!curr[key] || typeof curr[key] !== 'object') {
          curr[key] = {};
        }
        curr = curr[key];
      }
      curr[parts[parts.length - 1]] = value;
    }

    render() {
      const sections = ['hero', 'trust', 'about', 'specializations', 'experience', 'education', 'achievements', 'publications', 'testimonials', 'cta', 'contact'];
      sections.forEach(section => {
        if (this.data[`${section}.visible`] !== undefined) {
          this.setSectionVisibility(section, this.data[`${section}.visible`]);
        }
      });
    }
  }

  // Instantiate runtime on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new CampusCVRuntime());
  } else {
    new CampusCVRuntime();
  }
})();
