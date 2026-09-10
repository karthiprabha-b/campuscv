import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  const next = requestUrl.searchParams.get('next') || '/auth/login?verified=true';

  // Determine real public origin (handles VPS, reverse proxy, Nginx, Traefik)
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
  const host = forwardedHost || request.headers.get('host') || requestUrl.host;
  
  let publicOrigin = `${forwardedProto}://${host}`;
  if (host.includes('localhost') && process.env.NODE_ENV === 'production') {
    publicOrigin = process.env.NEXT_PUBLIC_APP_URL ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, '') : 'https://campuscv.in';
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zldmcrysbcwfzfhoggtx.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsZG1jcnlzYmN3ZnpmaG9nZ3R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MjM5NTIsImV4cCI6MjEwMjE5OTk1Mn0.gmoo5ME8UITh6VdbGzQob9TgdTBIjK3Ageb_x3IgAPQ';

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    if (code) {
      await supabase.auth.exchangeCodeForSession(code);
    } else if (token_hash && type) {
      await supabase.auth.verifyOtp({ token_hash, type: type as any });
    }
  } catch (err) {
    console.error('[Auth Callback] Error handling verification token:', err);
  }

  // Redirect to requested next page (e.g. /auth/reset-password for password recovery)
  const targetUrl = next.startsWith('/') ? next : `/${next}`;
  return NextResponse.redirect(new URL(targetUrl, publicOrigin));
}
