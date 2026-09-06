'use client';

import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

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
        toast.success(data.message || 'Successfully registered!');
        setFormData({ name: '', email: '', phone: '' }); // Clear form
      } else {
        toast.error(data.error || 'Failed to register.');
      }
    } catch (error: any) {
      toast.error('Network error. Is the backend running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0f172a',
      fontFamily: '"Inter", sans-serif',
      padding: '20px'
    }}>
      <Toaster position="top-right" />
      
      <div style={{
        backgroundColor: '#1e293b',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
        width: '100%',
        maxWidth: '450px',
        border: '1px solid #334155'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🌐</div>
          <h1 style={{ color: '#f8fafc', fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>Create an Account</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '8px' }}>
            Join the Smart Logistics Network
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div>
            <label htmlFor="name" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '8px',
                backgroundColor: '#0f172a', border: '1px solid #334155',
                color: 'white', fontSize: '0.95rem', boxSizing: 'border-box',
                outline: 'none', transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#38bdf8'}
              onBlur={(e) => e.target.style.borderColor = '#334155'}
            />
          </div>

          <div>
            <label htmlFor="email" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '8px',
                backgroundColor: '#0f172a', border: '1px solid #334155',
                color: 'white', fontSize: '0.95rem', boxSizing: 'border-box',
                outline: 'none', transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#38bdf8'}
              onBlur={(e) => e.target.style.borderColor = '#334155'}
            />
          </div>

          <div>
            <label htmlFor="phone" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+91 9876543210"
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '8px',
                backgroundColor: '#0f172a', border: '1px solid #334155',
                color: 'white', fontSize: '0.95rem', boxSizing: 'border-box',
                outline: 'none', transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#38bdf8'}
              onBlur={(e) => e.target.style.borderColor = '#334155'}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              marginTop: '10px', width: '100%', padding: '14px',
              backgroundColor: isSubmitting ? '#475569' : '#0284c7',
              color: 'white', border: 'none', borderRadius: '8px',
              fontSize: '1rem', fontWeight: 700, cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            {isSubmitting ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: '#64748b' }}>
          <a href="/" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}>← Back to Dashboard</a>
        </div>
      </div>
    </div>
  );
}
