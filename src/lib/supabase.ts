import 'react-native-url-polyfill/auto';
import 'expo-sqlite/localStorage/install';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabasePublishableKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabaseConfigured = Boolean(
  supabaseUrl && supabasePublishableKey,
);

const authStorage =
  typeof globalThis.localStorage === 'undefined'
    ? undefined
    : globalThis.localStorage;

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
