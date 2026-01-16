import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { syncUserToDatabase } from '@/lib/utils/syncUser';

/**
 * Auth Callback Route
 *
 * Handles the OAuth callback from Supabase Auth.
 * Exchanges the auth code for a session and syncs the user to the database.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/session';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Sync user to our database
      try {
        await syncUserToDatabase(data.user);
      } catch (syncError) {
        console.error('Failed to sync user to database:', syncError);
        // Don't block login if sync fails - it can be retried later
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return to login with error if code exchange failed
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
