/**
 * groqExtractor.ts — Ultra-Fast AI Resume Extraction via Groq
 *
 * Uses high-speed LLM inference (e.g. openai/gpt-oss-120b, openai/gpt-oss-20b, qwen/qwen3.6-27b)
 * to perform reliable structured resume extraction directly into CampusProfile JSON schema.
 */

import { CampusProfile, createEmptyCanonicalProfile, normalizeToCanonicalProfile } from '../../types/canonicalProfile';
import { sanitizeAndValidateProfile } from '../validate/validateExtraction';

const DEFAULT_GROQ_KEY = process.env.GROQ_API_KEY || '';

const CANDIDATE_MODELS = [
  process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'qwen/qwen3.6-27b'
];

const SYSTEM_PROMPT = `You are a high-precision AI resume parsing engine.
Your task is to extract all candidate information from the provided resume text into a strict, structured JSON format.

CRITICAL EXTRACTION RULES:
1. ONLY extract information that is explicitly stated in the resume. DO NOT invent or extrapolate facts, degrees, GPAs, or companies.
2. If GPA is not stated, leave "cgpa": "". NEVER invent or assume a GPA.
3. Keep projects and work experience strictly separate. Projects belong in "projects", not "experience".
4. Extract skills as concise individual skill names (e.g., "Python", "Next.js", "PostgreSQL"), NOT long sentences or phrases.
5. In "personal", extract the candidate's exact full name and their headline/tagline. In "summary", provide a crisp, punchy, professional summary of STRICTLY a small paragraph (1 to 2 short sentences, 25–40 words max). Focus directly on their core domain, major skills, and career goal. NEVER output huge, vague, repetitive, or rambling walls of text.
6. In "education", extract institution, degree, and field of study / specialization.
7. In "certifications", extract EVERY certificate, online course completion, license, accreditation, and award listed in the resume (including title/name, issuer/organization, issue date, and credential URL if available). DO NOT omit any certifications.
8. Return ONLY a valid JSON object matching the requested schema. No markdown formatting, no commentary.

SCHEMA DEFINITION:
{
  "personal": {
    "fullName": "string",
    "headline": "string",
    "email": "string",
    "phone": "string",
    "city": "string",
    "state": "string",
    "country": "string",
    "summary": "string (concise 1-2 sentence professional bio/summary, 25-40 words max)"
  },
  "experience": [
    {
      "company": "string",
      "role": "string",
      "employmentType": "Full-time | Internship | Freelance | Contract",
      "startDate": "string",
      "endDate": "string",
      "current": boolean,
      "location": "string",
      "description": "string",
      "achievements": ["string"],
      "technologies": ["string"]
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["string"],
      "githubUrl": "string",
      "liveUrl": "string",
      "achievements": ["string"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "department": "string",
      "specialization": "string",
      "startYear": "string",
      "endYear": "string",
      "cgpa": "string",
      "description": "string"
    }
  ],
  "skills": [
    {
      "name": "string",
      "category": "string",
      "proficiency": "Beginner | Intermediate | Advanced | Expert"
    }
  ],
  "certifications": [
    {
      "name": "string",
      "organization": "string",
      "issueDate": "string",
      "credentialUrl": "string"
    }
  ],
  "languages": [
    {
      "name": "string",
      "proficiency": "Native | Fluent | Professional | Basic"
    }
  ],
  "social": {
    "linkedin": "string",
    "github": "string",
    "twitter": "string",
    "portfolio": "string",
    "otherLinks": []
  }
}`;

export interface GroqExtractionResult {
  success: boolean;
  profile?: CampusProfile;
  modelUsed?: string;
  error?: string;
  latencyMs?: number;
}

export async function extractResumeWithGroq(
  resumeText: string,
  fileName: string = 'resume.pdf'
): Promise<GroqExtractionResult> {
  const apiKey = process.env.GROQ_API_KEY || DEFAULT_GROQ_KEY;
  if (!apiKey) {
    return { success: false, error: 'GROQ_API_KEY is not configured' };
  }

  if (!resumeText || resumeText.trim().length < 40) {
    return { success: false, error: 'Resume text is too short for AI extraction' };
  }

  const startTime = Date.now();
  let lastError = '';

  for (const model of CANDIDATE_MODELS) {
    try {
      console.log(`[GROQ AI EXTRACTION] Calling Groq API with model: ${model}...`);
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            {
              role: 'user',
              content: `Please parse and extract all details from this resume document (${fileName}):\n\n${resumeText}`
            }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.1,
          max_tokens: 4096
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.warn(`[GROQ AI EXTRACTION] Model ${model} returned status ${res.status}: ${errorText}`);
        lastError = `Status ${res.status}: ${errorText}`;
        continue;
      }

      const data = await res.json();
      const rawContent = data.choices?.[0]?.message?.content;

      if (!rawContent) {
        console.warn(`[GROQ AI EXTRACTION] Empty content returned from model ${model}`);
        continue;
      }

      const parsedJson = JSON.parse(rawContent);

      // Construct canonical CampusProfile using universal normalizer
      const profile = normalizeToCanonicalProfile(
        parsedJson,
        `port-${Date.now()}`,
        (parsedJson.personal?.fullName || 'user').toLowerCase().replace(/\s+/g, '-')
      );

      // Quality sanitization pass
      const sanitized = sanitizeAndValidateProfile(profile, resumeText);

      const latencyMs = Date.now() - startTime;
      console.log(`[GROQ AI EXTRACTION] SUCCESS with model ${model} in ${latencyMs}ms. Extracted ${sanitized.experience.length} experiences, ${sanitized.projects.length} projects, ${sanitized.education.length} education records, ${sanitized.skills.length} skills.`);

      return {
        success: true,
        profile: sanitized,
        modelUsed: model,
        latencyMs
      };
    } catch (e: any) {
      console.error(`[GROQ AI EXTRACTION] Error with model ${model}:`, e);
      lastError = e.message || String(e);
    }
  }

  return {
    success: false,
    error: lastError || 'Failed to extract resume with Groq AI'
  };
}
