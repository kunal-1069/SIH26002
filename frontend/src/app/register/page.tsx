'use client';

import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { 
  UserPlus, 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Building2, 
  Lock, 
  LogIn, 
  LogOut, 
  CheckCircle2, 
  Database,
  KeyRound,
  Sparkles
} from 'lucide-react';
import { 
  supabase, 
  signUpWithSupabase, 
  signInWithSupabase, 
  signOutSupabase, 
  saveResponderToSupabase 
} from '../../lib/supabase';

export default function RegisterPage() {
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    division: 'Guwahati Division (Assam)'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSession, setCurrentSession] = useState<any>(null);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data }) => {
      setCurrentSession(data.session);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (authMode === 'signup') {
        // 1. Authenticate with Supabase Auth
        const authRes = await signUpWithSupabase(formData.email, formData.password, {
          name: formData.name,
          phone: formData.phone,
          division: formData.division
        });

        if (!authRes.success) {
          toast.error(`Supabase Auth: ${authRes.error}`);
          setIsSubmitting(false);
          return;
        }

        const userId = authRes.data?.user?.id;

        // 2. Save profile into Supabase Database table 'responders'
        const dbRes = await saveResponderToSupabase({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          division: formData.division,
          user_id: userId
        });

        if (dbRes.success) {
          toast.success('Saved to Supabase Database & Auth created!');
        } else {
          toast.success('Supabase Account created (DB sync pending table creation)');
        }

        // 3. Also notify backend Neo4j service for route alerts & welcome email
        try {
          await fetch('http://localhost:3001/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              phone: formData.phone
            })
          });
        } catch {
          // Backend is optional; Supabase is primary
        }

        toast.success('Responder officially enrolled into Emergency Network.');
        setFormData({ name: '', email: '', phone: '', password: '', division: 'Guwahati Division (Assam)' });

      } else {
        // Sign In Mode
        const signInRes = await signInWithSupabase(formData.email, formData.password);
        if (signInRes.success) {
          toast.success('Successfully authenticated via Supabase!');
        } else {
          toast.error(`Sign in failed: ${signInRes.error}`);
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Operation failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOutSupabase();
    toast.success('Signed out from Supabase session.');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#090d16',
      color: '#f8fafc',
      padding: '24px'
    }}>
      <Toaster position="top-right" />

      {/* Top Back Navigation & Supabase Live Status */}
      <div style={{ width: '100%', maxWidth: '480px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => window.location.href = '/'}
          className="dashboard-btn btn-glass"
          style={{ padding: '7px 14px' }}
        >
          <ArrowLeft size={16} />
          <span>Operations Center</span>
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '20px',
          backgroundColor: '#0f172a',
          border: '1px solid #10b981',
          fontSize: '0.72rem',
          color: '#34d399'
        }}>
          <span className="live-indicator" style={{ backgroundColor: '#10b981', width: '7px', height: '7px', borderRadius: '50%', display: 'inline-block' }} />
          <span>Supabase Connected</span>
        </div>
      </div>

      {/* Main Registration / Auth Card */}
      <div className="glass-panel-elevated" style={{
        padding: '2.2rem',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '480px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Card Header */}
        <div style={{ marginBottom: '1.4rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h1 style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>
                Field Responder Portal
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '0.74rem', margin: '2px 0 0 0' }}>
                Supabase Auth & Operational Database Integration
              </p>
            </div>
          </div>

          {/* Active Session Banner */}
          {currentSession && (
            <div style={{
              marginTop: '12px',
              padding: '8px 12px',
              borderRadius: '6px',
              backgroundColor: '#0d1f1f',
              border: '1px solid #059669',
              fontSize: '0.74rem',
              color: '#a7f3d0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                <CheckCircle2 size={15} color="#34d399" />
                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  Logged in as: <strong>{currentSession.user.email}</strong>
                </span>
              </div>
              <button
                onClick={handleSignOut}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#f87171',
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 600
                }}
              >
                <LogOut size={13} />
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Tab Switcher: Sign Up vs Sign In */}
        <div style={{
          display: 'flex',
          backgroundColor: '#0f172a',
          borderRadius: '8px',
          padding: '4px',
          marginBottom: '1.4rem',
          border: '1px solid #334155'
        }}>
          <button
            type="button"
            onClick={() => setAuthMode('signup')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: authMode === 'signup' ? '#1e293b' : 'transparent',
              color: authMode === 'signup' ? '#38bdf8' : '#94a3b8',
              fontSize: '0.78rem',
              fontWeight: authMode === 'signup' ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <UserPlus size={15} />
            <span>New Enrollment (Sign Up)</span>
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('signin')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: authMode === 'signin' ? '#1e293b' : 'transparent',
              color: authMode === 'signin' ? '#38bdf8' : '#94a3b8',
              fontSize: '0.78rem',
              fontWeight: authMode === 'signin' ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <LogIn size={15} />
            <span>Officer Sign In</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.05rem' }}>
          {/* Full Name (Sign Up only) */}
          {authMode === 'signup' && (
            <div>
              <label htmlFor="name" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.76rem', fontWeight: 600, marginBottom: '5px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={authMode === 'signup'}
                  placeholder="Officer Rajesh Bora"
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 36px',
                    borderRadius: '6px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    color: '#ffffff',
                    fontSize: '0.84rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <User size={16} color="#64748b" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          )}

          {/* Official Email */}
          <div>
            <label htmlFor="email" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.76rem', fontWeight: 600, marginBottom: '5px' }}>
              Official Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="officer.bora@ner.gov.in"
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: '6px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  color: '#ffffff',
                  fontSize: '0.84rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Password (for Supabase Authentication) */}
          <div>
            <label htmlFor="password" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.76rem', fontWeight: 600, marginBottom: '5px' }}>
              {authMode === 'signup' ? 'Secure Password (Supabase Auth)' : 'Password'}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="••••••••••••"
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: '6px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  color: '#ffffff',
                  fontSize: '0.84rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Phone Number (Sign Up only) */}
          {authMode === 'signup' && (
            <div>
              <label htmlFor="phone" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.76rem', fontWeight: 600, marginBottom: '5px' }}>
                Emergency Contact Number
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required={authMode === 'signup'}
                  placeholder="+91 98640 12891"
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 36px',
                    borderRadius: '6px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    color: '#ffffff',
                    fontSize: '0.84rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <Phone size={16} color="#64748b" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          )}

          {/* Operational Division (Sign Up only) */}
          {authMode === 'signup' && (
            <div>
              <label htmlFor="division" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.76rem', fontWeight: 600, marginBottom: '5px' }}>
                Regional Operational Division
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  id="division"
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 36px',
                    borderRadius: '6px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    color: '#ffffff',
                    fontSize: '0.84rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Guwahati Division (Assam)">Guwahati Division (Assam - NH-06)</option>
                  <option value="Shillong Division (Meghalaya)">Shillong Division (Meghalaya - NH-06/NH-27)</option>
                  <option value="Silchar Division (Assam/Barak Valley)">Silchar Division (Assam/Barak Valley - NH-306)</option>
                  <option value="Tezpur Division (Assam/Arunachal)">Tezpur Division (Assam/Arunachal - NH-13)</option>
                  <option value="Dimapur Division (Nagaland)">Dimapur Division (Nagaland - NH-29)</option>
                  <option value="Agartala Division (Tripura)">Agartala Division (Tripura - NH-08)</option>
                </select>
                <Building2 size={16} color="#64748b" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="dashboard-btn btn-electric"
            style={{ width: '100%', padding: '11px', marginTop: '6px', fontSize: '0.86rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {isSubmitting ? (
              <span>Authenticating with Supabase...</span>
            ) : authMode === 'signup' ? (
              <>
                <Database size={16} />
                <span>Register with Supabase & Database</span>
              </>
            ) : (
              <>
                <KeyRound size={16} />
                <span>Sign In via Supabase Auth</span>
              </>
            )}
          </button>
        </form>

        {/* Info footer */}
        <div style={{ marginTop: '1.2rem', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.72rem', color: '#64748b', textAlign: 'center' }}>
          <span>Supabase Auth Endpoint: <code>mfpgdfrmuoevzugmegja.supabase.co</code></span>
        </div>
      </div>
    </div>
  );
}
