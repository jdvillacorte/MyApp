import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';

import { authStorage } from './auth-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabasePublishableKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabaseConfigured = Boolean(
  supabaseUrl && supabasePublishableKey,
);

export const supabase =
  supabaseUrl && supabasePublishableKey
    ? createClient(supabaseUrl, supabasePublishableKey, {
        auth: {
          storage: authStorage,
          autoRefreshToken: true,
          persistSession: Boolean(authStorage),
          detectSessionInUrl: false,
        },
      })
    : null;
