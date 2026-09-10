export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { POST as parseResumeHandler } from '../resume/parse/route';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  return parseResumeHandler(request);
}
