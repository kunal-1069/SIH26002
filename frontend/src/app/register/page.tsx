'use client';

import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { UserPlus, ArrowLeft, User, Mail, Phone, ShieldCheck, Building2, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    division: 'Guwahati Division (Assam)'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        toast.success(data.message || 'Responder profile registered successfully.');
        setFormData({ name: '', email: '', phone: '', division: 'Guwahati Division (Assam)' });
      } else {
        toast.error(data.error || 'Registration failed. Please check details.');
      }
    } catch (error: any) {
      toast.error('Network error. Verify service connection.');
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
      padding: '24px'
    }}>
      <Toaster position="top-right" />

      {/* Top Back Navigation */}
      <div style={{ width: '100%', maxWidth: '460px', marginBottom: '14px' }}>
        <button
          onClick={() => window.location.href = '/'}
          className="dashboard-btn btn-glass"
          style={{ padding: '7px 14px' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Operations Center</span>
        </button>
      </div>

      {/* Main Registration Card */}
      <div className="glass-panel-elevated" style={{
        padding: '2.5rem',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '460px',
        border: '1px solid rgba(255, 255, 255, 0.12)'
      }}>
        {/* Card Header */}
        <div style={{ marginBottom: '1.8rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px' }}>
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
              <h1 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>
                Field Responder Enrollment
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '2px 0 0 0' }}>
                North East Regional Logistics & Emergency Protocol Network
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {/* Full Name */}
          <div>
            <label htmlFor="name" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px' }}>
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
                placeholder="Rajesh Bora"
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: '6px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  color: '#ffffff',
                  fontSize: '0.86rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <User size={16} color="#64748b" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Official Email */}
          <div>
            <label htmlFor="email" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px' }}>
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
                  padding: '10px 12px 10px 36px',
                  borderRadius: '6px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  color: '#ffffff',
                  fontSize: '0.86rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px' }}>
              Direct Contact Number
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+91 98640 12891"
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: '6px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  color: '#ffffff',
                  fontSize: '0.86rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <Phone size={16} color="#64748b" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Operational Division */}
          <div>
            <label htmlFor="division" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px' }}>
              Regional Division
            </label>
            <div style={{ position: 'relative' }}>
              <select
                id="division"
                name="division"
                value={formData.division}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: '6px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  color: '#ffffff',
                  fontSize: '0.86rem',
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="dashboard-btn btn-electric"
            style={{ width: '100%', padding: '11px', marginTop: '6px', fontSize: '0.86rem' }}
          >
            {isSubmitting ? (
              <span>Submitting Record...</span>
            ) : (
              <>
                <UserPlus size={16} />
                <span>Register Official Responder</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
