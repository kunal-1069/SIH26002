import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mfpgdfrmuoevzugmegja.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_kzPTciGQHCtLPCDBlZFxFA_rV3rQERv';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface ResponderProfile {
  id?: string;
  user_id?: string;
  name: string;
  email: string;
  phone: string;
  division: string;
  role?: string;
  created_at?: string;
}

export interface IncidentRecord {
  id?: string;
  latitude: number;
  longitude: number;
  hazard_type: string;
  severity: string;
  description: string;
  reported_by?: string;
  created_at?: string;
  metadata?: Record<string, any>;
}

/**
 * Sign up a new responder with Supabase Auth
 */
export async function signUpWithSupabase(email: string, password: string, metadata: { name: string; phone?: string; division?: string }) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: metadata.name,
          phone: metadata.phone,
          division: metadata.division,
        },
      },
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error('Supabase Auth SignUp error:', error);
    return { success: false, error: error.message || 'Authentication error' };
  }
}

/**
 * Sign in an existing responder with Supabase Auth
 */
export async function signInWithSupabase(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error('Supabase Auth SignIn error:', error);
    return { success: false, error: error.message || 'Authentication failed' };
  }
}

/**
 * Sign out current user
 */
export async function signOutSupabase() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Supabase Auth SignOut error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Save / Enroll a responder profile in Supabase database
 */
export async function saveResponderToSupabase(profile: ResponderProfile) {
  try {
    const { data, error } = await supabase
      .from('responders')
      .insert([
        {
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          division: profile.division,
          user_id: profile.user_id || null,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.warn('Supabase DB responders table notice:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (error: any) {
    console.warn('Supabase DB error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Insert an incident report into Supabase database
 */
export async function saveIncidentToSupabase(incident: IncidentRecord) {
  try {
    const { data, error } = await supabase
      .from('incident_reports')
      .insert([
        {
          latitude: incident.latitude,
          longitude: incident.longitude,
          hazard_type: incident.hazard_type,
          severity: incident.severity,
          description: incident.description,
          reported_by: incident.reported_by || 'Field Responder',
          created_at: new Date().toISOString(),
          metadata: incident.metadata || {},
        },
      ])
      .select();

    if (error) {
      console.warn('Supabase DB incident_reports table notice:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (error: any) {
    console.warn('Supabase DB incident save error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Query recent incidents from Supabase database
 */
export async function fetchIncidentsFromSupabase(limit = 20) {
  try {
    const { data, error } = await supabase
      .from('incident_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return { success: false, error: error.message, data: [] };
    }
    return { success: true, data: data || [] };
  } catch (error: any) {
    return { success: false, error: error.message, data: [] };
  }
}
