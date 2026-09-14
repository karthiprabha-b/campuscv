import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

// Prompts per content type
function buildPrompt(type: string, context: Record<string, string>): string {
  switch (type) {
    case 'bio':
      return `Write a concise, punchy professional bio (2-3 sentences, max 55 words) for a portfolio website.
Name: ${context.name || 'the candidate'}
Title: ${context.title || context.headline || 'Professional'}
Field: ${context.field || 'Technology'}
Existing notes: ${context.existing || context.summary || ''}

Rules:
- First person, confident, energetic tone
- Highlight their domain + top strength + ambition
- No fluff. No "passionate about". No vague adjectives.
- Return ONLY the bio text, no quotes, no explanation.`;

    case 'experience_bullet':
      return `Write one powerful achievement bullet point for a resume/portfolio (max 25 words).
Role: ${context.role || 'Developer'}
Company: ${context.company || 'a company'}
Description/context: ${context.existing || context.description || ''}

Rules:
- Start with an action verb (Built, Led, Reduced, Engineered, Designed, etc.)
- Include a quantifiable result if possible (%, speed, users, etc.)
- Be specific and technical
- Return ONLY the bullet text, no dash prefix, no quotes.`;

    case 'project_description':
      return `Write a crisp 2-sentence project description for a portfolio card (max 45 words).
Project name: ${context.title || context.name || 'the project'}
Technologies: ${context.technologies || 'various technologies'}
Context/notes: ${context.existing || context.description || ''}

Rules:
- Sentence 1: What it is and what problem it solves
- Sentence 2: Key tech or architecture highlight + impact/scale
- No "I built". Write in third person or project-centric voice.
- Return ONLY the description text, no quotes.`;

    default:
      return `Generate professional content for: ${JSON.stringify(context)}`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, context } = body as { type: string; context: Record<string, string> };

    if (!type || !context) {
      return NextResponse.json({ success: false, error: 'Missing type or context' }, { status: 400 });
    }

    if (!GROQ_KEY) {
      return NextResponse.json({ success: false, error: 'AI service not configured' }, { status: 503 });
    }

    const prompt = buildPrompt(type, context);

    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: 'You are a professional portfolio copywriter. Return only the requested text, nothing else.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 256,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[AI GENERATE] Groq error:', errText);
      return NextResponse.json({ success: false, error: 'AI generation failed' }, { status: 502 });
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content?.trim();

    if (!text) {
      return NextResponse.json({ success: false, error: 'Empty response from AI' }, { status: 502 });
    }

    return NextResponse.json({ success: true, text });
  } catch (err: any) {
    console.error('[AI GENERATE] Error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal error' }, { status: 500 });
  }
}
