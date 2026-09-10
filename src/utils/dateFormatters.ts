/**
 * dateFormatters.ts — Single Source of Truth Date Normalization & Formatting
 *
 * Requirements:
 * - Start date must render correctly.
 * - End date must render correctly when present.
 * - Current/ongoing experience must be represented correctly (e.g., "Present").
 * - Education years must appear where the template expects them.
 * - Never swap month/year/day values.
 * - Never display invalid dates.
 * - Never display "undefined", "Invalid Date", or empty date artifacts like "2024 - ".
 */

export interface DateRangeInput {
  startDate?: string | number | null;
  endDate?: string | number | null;
  startYear?: string | number | null;
  endYear?: string | number | null;
  year?: string | number | null;
  current?: boolean | null;
  period?: string | null;
  duration?: string | null;
  dates?: string | null;
}

export function cleanDateString(val?: string | number | null): string {
  if (val === undefined || val === null) return '';
  const str = String(val).trim();
  if (str === '' || str.toLowerCase() === 'undefined' || str.toLowerCase() === 'null' || str.toLowerCase() === 'invalid date') {
    return '';
  }
  return str;
}

/**
 * Normalizes a single date or date range into a clean, human-readable string.
 * Examples:
 * - { startDate: 'Jan 2022', endDate: 'Mar 2024' } -> 'Jan 2022 - Mar 2024'
 * - { startDate: '2022', current: true } -> '2022 - Present'
 * - { year: '2024' } -> '2024'
 * - { startYear: '2020', endYear: '2024' } -> '2020 - 2024'
 * - { startDate: '2021' } -> '2021' (no dangling hyphen!)
 */
export function formatNormalizedDateRange(input: DateRangeInput): string {
  if (!input) return '';

  // 1. If explicit pre-formatted period or duration exists and is valid
  const rawPeriod = cleanDateString(input.period || input.duration || input.dates);
  if (rawPeriod && !rawPeriod.endsWith('-') && !rawPeriod.endsWith('–') && !rawPeriod.includes('undefined')) {
    // Normalize any weird double spaces or dashes
    const cleaned = rawPeriod.replace(/\s*[-–—]\s*/g, ' - ').trim();
    if (cleaned && !cleaned.endsWith('-')) return cleaned;
  }

  const start = cleanDateString(input.startDate || input.startYear || (rawPeriod ? rawPeriod.split(/[-–—to]+/i)[0]?.trim() : ''));
  const isCurrent = Boolean(input.current);
  let end = cleanDateString(input.endDate || input.endYear || (rawPeriod && rawPeriod.includes('-') ? rawPeriod.split(/[-–—to]+/i)[1]?.trim() : ''));

  if (isCurrent && !end) {
    end = 'Present';
  } else if (/^(present|current|now)$/i.test(end)) {
    end = 'Present';
  }

  // If only a single year or date exists
  if (start && !end) {
    return start;
  }
  if (!start && end) {
    return end;
  }
  if (start && end) {
    if (start === end) return start;
    return `${start} - ${end}`;
  }

  // Fallback to explicit single year
  const singleYear = cleanDateString(input.year);
  if (singleYear) return singleYear;

  return '';
}

/**
 * Normalizes an Experience record's date fields so all templates receive uniform values.
 */
export function normalizeExperienceDates(exp: Record<string, any>): Record<string, any> {
  const start = cleanDateString(exp.startDate || exp.start || (exp.period ? String(exp.period).split(/[-–—to]+/i)[0]?.trim() : ''));
  const current = Boolean(exp.current || (typeof exp.endDate === 'string' && /present|current/i.test(exp.endDate)));
  const end = current ? 'Present' : cleanDateString(exp.endDate || exp.end || (exp.period && String(exp.period).includes('-') ? String(exp.period).split(/[-–—to]+/i)[1]?.trim() : ''));

  const formatted = formatNormalizedDateRange({
    startDate: start,
    endDate: end,
    current,
    period: exp.period
  });

  return {
    startDate: start,
    endDate: end,
    current,
    period: formatted,
    duration: formatted,
    dates: formatted,
    year: formatted || start || end || ''
  };
}

/**
 * Normalizes an Education record's date fields so all templates receive uniform values.
 */
export function normalizeEducationDates(edu: Record<string, any>): Record<string, any> {
  const start = cleanDateString(edu.startYear || edu.startDate || edu.start || '');
  const end = cleanDateString(edu.endYear || edu.endDate || edu.end || edu.graduationYear || edu.year || '');
  const rawPeriod = cleanDateString(edu.period || edu.duration || edu.years);

  // If only one year was provided, it's typically the graduation/completion year
  let formatted = '';
  if (start && end && start !== end) {
    formatted = `${start} - ${end}`;
  } else if (end) {
    formatted = end;
  } else if (start) {
    formatted = start;
  } else if (rawPeriod) {
    formatted = rawPeriod.replace(/\s*[-–—]\s*/g, ' - ').trim();
  }

  return {
    startYear: start,
    endYear: end,
    startDate: start,
    endDate: end,
    year: end || start || formatted || '',
    graduationYear: end || start || formatted || '',
    period: formatted,
    duration: formatted,
    years: formatted
  };
}
