'use client';

import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { UserPlus, ArrowLeft, User, Mail, Phone, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('http://localhost:3001/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || 'Successfully registered responder profile!');
        setFormData({ name: '', email: '', phone: '' });
      } else {
        toast.error(data.error || 'Failed to register.');
      }
    } catch (error: any) {
      toast.error('Network error. Verify backend container is running.');
    } finally {
      setIsSubmitting(false);
    }
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
      padding: '20px'
    }}>
      <Toaster position="top-right" />

      <div style={{ width: '100%', maxWidth: '440px', marginBottom: '12px' }}>
        <button
          onClick={() => window.location.href = '/'}
          className="dashboard-btn btn-glass"
          style={{ padding: '6px 12px' }}
        >
          <ArrowLeft size={16} />
          <span>Return to Command Center</span>
        </button>
      </div>

      <div className="glass-panel-elevated" style={{
        padding: '2.5rem',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '440px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            margin: '0 auto 12px auto',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)'
          }}>
            <UserPlus size={24} color="#ffffff" />
          </div>
          <h1 style={{ color: '#ffffff', fontSize: '1.45rem', fontWeight: 800, margin: 0 }}>
            Responder Portal Access
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '6px' }}>
            Seven Sisters Logistics & Geotechnical Sentry Network
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label htmlFor="name" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Capt. John Doe"
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
              <User size={16} color="#64748b" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label htmlFor="email" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
              Official Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="officer@logistics.gov.in"
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
              <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label htmlFor="phone" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
              Field Dispatch Contact
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+91 98765 43210"
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
              <Phone size={16} color="#64748b" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="dashboard-btn btn-electric"
            style={{ width: '100%', padding: '12px', marginTop: '6px', fontSize: '0.88rem' }}
          >
            {isSubmitting ? (
              <span>Registering Profile...</span>
            ) : (
              <>
                <ShieldCheck size={16} />
                <span>Register Emergency Profile</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
