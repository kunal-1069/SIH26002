'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  Lock,
  LogIn,
  LogOut,
  RefreshCw,
  KeyRound,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Navigation,
  Radio,
  Clock,
  Compass,
  Menu,
  X,
  Star,
  Award,
  Zap,
  ArrowRight,
  Building2
} from 'lucide-react';
import { supabase, signInWithSupabase, signOutSupabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export default function ModernRenukaLogisticsPage() {
  // Authentication State
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hero Slider State
  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [
    {
      img: '/uploads/slider/5.jpg',
      badge: 'Pan-India Heavy Commercial Fleet',
      title: 'We Respect Your Trust With Every Consignment',
      subtitle: 'Cost-effective logistics services and supply-chain management solution for domestic and international enterprises.',
      cta: 'Track Consignment Radar'
    },
    {
      img: '/uploads/slider/14.jpg',
      badge: 'End-to-End Multimodal Transport',
      title: 'Integrated Supply Chain & Smart Haulage Solutions',
      subtitle: 'Next-generation freight dispatching, scheduled full truckload routes, and nationwide warehouse distribution networks.',
      cta: 'Track Consignment Radar'
    },
    {
      img: '/uploads/slider/15.jpg',
      badge: 'Zero-Interruption Cargo Mobility',
      title: 'Move Your Enterprise Forward With Confidence',
      subtitle: 'Without any interruption: full truckload, LVC, and heavy vehicle load across 28 Indian states.',
      cta: 'Track Consignment Radar'
    }
  ];

  // Auto-slide timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Supabase Auth Sync
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSupabaseUser({
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          role: 'Verified Highway Responder'
        });
      } else {
        const stored = localStorage.getItem('bharat_suraksha_officer');
        if (stored) {
          try {
            setSupabaseUser(JSON.parse(stored));
          } catch (_) {}
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userObj = {
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          role: 'Verified Highway Responder'
        };
        setSupabaseUser(userObj);
        localStorage.setItem('bharat_suraksha_officer', JSON.stringify(userObj));
      } else {
        const stored = localStorage.getItem('bharat_suraksha_officer');
        if (!stored) setSupabaseUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUserSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('Please enter email and password');
      return;
    }
    setIsSigningIn(true);
    try {
      const { data, error } = await signInWithSupabase(loginEmail, loginPassword);
      if (error) {
        toast.error(`Sign in error: ${error.message}`);
      } else if (data?.user) {
        const userObj = {
          email: data.user.email,
          name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
          role: 'Verified Responder'
        };
        setSupabaseUser(userObj);
        localStorage.setItem('bharat_suraksha_officer', JSON.stringify(userObj));
        toast.success(`Welcome ${userObj.name}! Consignment Radar unlocked.`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication error');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleDemoSignIn = (role: 'OFFICER' | 'DRIVER') => {
    const userObj = role === 'OFFICER' ? {
      email: 'officer.ner@bharathighwaysuraksha.gov.in',
      name: 'Patrol Officer Sharma',
      role: 'NHAI Quick Response Unit'
    } : {
      email: 'driver.convoy7@renukalogistics.com',
      name: 'Gurpreet Singh',
      role: 'Heavy HCV Convoy Lead'
    };
    setSupabaseUser(userObj);
    localStorage.setItem('bharat_suraksha_officer', JSON.stringify(userObj));
    toast.success(`Access Granted: ${userObj.name} (${userObj.role})`);
  };

  const handleSignOut = async () => {
    await signOutSupabase();
    localStorage.removeItem('bharat_suraksha_officer');
    setSupabaseUser(null);
    toast.success('Signed out successfully');
  };

  return (
    <div className="renuka-body" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      
      {/* ========================================================
          1. SLEEK TOPBAR (Deep Obsidian & Sapphire Blue Accent)
          ======================================================== */}
      <div style={{
        backgroundColor: '#090e17',
        color: '#ffffff',
        fontSize: '0.8rem',
        padding: '7px 0',
        borderBottom: '1px solid rgba(37, 99, 235, 0.2)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          {/* Left contact & live network badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#93c5fd' }}>
              <Phone size={13} color="#3b82f6" />
              <span>+91 9372433888 / +91(253) 3266888</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
              <Mail size={13} color="#3b82f6" />
              <span>info@renukalogistics.com</span>
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '2px 10px',
              borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              fontSize: '0.72rem',
              fontWeight: 700
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
              24/7 Pan-India Fleet Active
            </span>
          </div>

          {/* Right Social & Head Office Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.76rem', color: '#94a3b8' }}>
            <span>MIDC Satpur, Nashik</span>
            <span style={{ color: '#334155' }}>•</span>
            <a href="https://www.facebook.com/RenukaLogistics/" target="_blank" rel="noopener noreferrer" style={{ color: '#cbd5e1', textDecoration: 'none' }}>FB</a>
            <span style={{ color: '#334155' }}>•</span>
            <a href="https://twitter.com/RenukaLogistics" target="_blank" rel="noopener noreferrer" style={{ color: '#cbd5e1', textDecoration: 'none' }}>TW</a>
            <span style={{ color: '#334155' }}>•</span>
            <a href="https://www.linkedin.com/company/renuka-logistics" target="_blank" rel="noopener noreferrer" style={{ color: '#cbd5e1', textDecoration: 'none' }}>LI</a>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. TRANSLUCENT MODERN NAVBAR (Crisp Glass & Sapphire Accents)
          ======================================================== */}
      <header style={{
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 999,
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '12px 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo with Modern Sub-label */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img
              src="/images/logo.png"
              alt="Renuka Logistics"
              style={{ height: '46px', width: 'auto', display: 'block' }}
            />
            <div style={{ borderLeft: '1.5px solid #e2e8f0', paddingLeft: '10px' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Smart Freight Mobility
              </div>
              <div style={{ fontSize: '0.66rem', color: '#64748b' }}>
                ISO Certified Supply Chain
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link href="/" style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.84rem', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Home
            </Link>
            <a href="#about-us" style={{ color: '#334155', fontWeight: 600, fontSize: '0.84rem', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.03em', transition: 'color 0.2s' }}>
              About Us
            </a>
            <a href="#speciality" style={{ color: '#334155', fontWeight: 600, fontSize: '0.84rem', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.03em', transition: 'color 0.2s' }}>
              Routes & Speciality
            </a>
            <a href="#services" style={{ color: '#334155', fontWeight: 600, fontSize: '0.84rem', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.03em', transition: 'color 0.2s' }}>
              Services
            </a>
            <a href="#customer-reviews" style={{ color: '#334155', fontWeight: 600, fontSize: '0.84rem', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.03em', transition: 'color 0.2s' }}>
              Reviews
            </a>
            <a href="#sponsors" style={{ color: '#334155', fontWeight: 600, fontSize: '0.84rem', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.03em', transition: 'color 0.2s' }}>
              Clients
            </a>
            <a href="#consignment-radar" style={{
              color: '#f59e0b',
              fontWeight: 800,
              fontSize: '0.84rem',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              padding: '4px 10px',
              borderRadius: '16px'
            }}>
              <Radio size={13} color="#f59e0b" />
              Consignment Radar
            </a>

            {/* Saffron Amber Action CTA */}
            <a href="#consignment-radar" className="btn-modern-amber" style={{ padding: '8px 20px', fontSize: '0.82rem' }}>
              <Truck size={15} /> Track Consignment
            </a>
          </nav>
        </div>
      </header>

      {/* ========================================================
          3. MODERN HERO SLIDER (Sapphire & Amber High-Tech Overlay)
          ======================================================== */}
      <section style={{
        position: 'relative',
        width: '100%',
        minHeight: '580px',
        height: '68vh',
        maxHeight: '700px',
        overflow: 'hidden',
        backgroundColor: '#0a0f1d'
      }}>
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: activeSlide === idx ? 1 : 0,
              visibility: activeSlide === idx ? 'visible' : 'hidden',
              transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.9s ease',
              backgroundImage: `url(${slide.img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {/* High-tech radial vignette & sapphire tint */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, rgba(10, 15, 29, 0.88) 0%, rgba(10, 15, 29, 0.65) 50%, rgba(37, 99, 235, 0.25) 100%)'
            }} />

            <div style={{
              position: 'relative',
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 2rem',
              width: '100%',
              color: '#ffffff'
            }}>
              <div style={{ maxWidth: '720px' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(37, 99, 235, 0.25)',
                  border: '1px solid rgba(59, 130, 246, 0.5)',
                  color: '#93c5fd',
                  padding: '5px 16px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '1.2rem',
                  backdropFilter: 'blur(8px)'
                }}>
                  <Zap size={14} color="#60a5fa" />
                  {slide.badge}
                </div>

                <h1 className="font-outfit" style={{
                  fontSize: 'clamp(2.3rem, 5.2vw, 3.9rem)',
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: 1.15,
                  margin: '0 0 1.2rem 0',
                  letterSpacing: '-0.02em',
                  textShadow: '0 4px 20px rgba(0,0,0,0.7)'
                }}>
                  {slide.title}
                </h1>

                <p style={{
                  fontSize: 'clamp(0.96rem, 1.8vw, 1.15rem)',
                  color: '#e2e8f0',
                  lineHeight: 1.65,
                  margin: '0 0 2.2rem 0',
                  maxWidth: '600px',
                  textShadow: '0 2px 8px rgba(0,0,0,0.7)'
                }}>
                  {slide.subtitle}
                </p>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <a href="#consignment-radar" className="btn-modern-amber" style={{ padding: '13px 30px', fontSize: '0.94rem' }}>
                    <Truck size={18} /> {slide.cta}
                  </a>
                  <a href="#services" className="btn-modern-outline-white" style={{ padding: '13px 28px', fontSize: '0.94rem' }}>
                    Fleet Solutions <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Floating Controls */}
        <button
          onClick={() => setActiveSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
          style={{
            position: 'absolute',
            left: '24px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#ffffff',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s',
            zIndex: 10,
            backdropFilter: 'blur(8px)'
          }}
          aria-label="Previous Slide"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={() => setActiveSlide((prev) => (prev + 1) % heroSlides.length)}
          style={{
            position: 'absolute',
            right: '24px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#ffffff',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s',
            zIndex: 10,
            backdropFilter: 'blur(8px)'
          }}
          aria-label="Next Slide"
        >
          <ChevronRight size={22} />
        </button>

        {/* Slide Indicators */}
        <div style={{
          position: 'absolute',
          bottom: '22px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          zIndex: 10
        }}>
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              style={{
                width: activeSlide === idx ? '32px' : '10px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: activeSlide === idx ? '#38bdf8' : 'rgba(255,255,255,0.4)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ========================================================
          4. STATS COUNTER STRIP (Titanium Blue Strip)
          ======================================================== */}
      <div style={{
        backgroundColor: '#0f172a',
        borderBottom: '1px solid rgba(37, 99, 235, 0.25)',
        padding: '24px 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(37, 99, 235, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
              <Clock size={24} />
            </div>
            <div>
              <div className="font-outfit" style={{ fontSize: '1.7rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>25+ Years</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>Logistics Domain Leadership</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
              <Truck size={24} />
            </div>
            <div>
              <div className="font-outfit" style={{ fontSize: '1.7rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>150+ Trucks</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>Dedicated Heavy HCV Fleet</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="font-outfit" style={{ fontSize: '1.7rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>99.4%</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>On-Time Safe Delivery Metric</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
              <Award size={24} />
            </div>
            <div>
              <div className="font-outfit" style={{ fontSize: '1.7rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>500+</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>Corporate Industrial Clients</div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          5. ABOUT US SECTION (Elevated Modern Cards)
          ======================================================== */}
      <section id="about-us" style={{ padding: '80px 0', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-block',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#2563eb',
              padding: '4px 14px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '10px'
            }}>
              Who We Are
            </div>
            <h2 className="font-outfit" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem 0' }}>
              Engineering High-Reliability <span className="gradient-text-blue">Supply Chain Solutions</span>
            </h2>
            <div className="title-line-modern" />
            <p style={{ maxWidth: '820px', margin: '0 auto', fontSize: '0.98rem', color: '#475569', lineHeight: 1.8 }}>
              A leading provider of innovative logistics and supply-chain solutions, Renuka Logistics has an extensive network in India. Get all types of transportation solutions you need to support your business growth. We offer customised and cost-effective transportation services for domestic and international customers.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem'
          }}>
            {/* Card 1: Our Mission */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '2.2rem',
              boxShadow: '0 10px 30px rgba(37, 99, 235, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s ease, border-color 0.3s ease'
            }}>
              <div style={{ display: 'flex', gap: '1.4rem', alignItems: 'center', marginBottom: '1.6rem', flexWrap: 'wrap' }}>
                <img
                  src="/images/mission.jpg"
                  alt="Our Mission"
                  style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 6px 18px rgba(0,0,0,0.1)' }}
                />
                <div>
                  <div style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    color: '#ffffff',
                    padding: '6px 18px',
                    borderRadius: '20px',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    marginBottom: '8px'
                  }}>
                    Our Mission
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#64748b' }}>Operational Excellence</div>
                </div>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem', color: '#334155' }}>
                  <CheckCircle2 size={18} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>To keep our promises and execute better than others.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem', color: '#334155' }}>
                  <CheckCircle2 size={18} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Being responsive and consistently delivering value.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem', color: '#334155' }}>
                  <CheckCircle2 size={18} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>To build long-term relationships with our customers.</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Our Vision */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '2.2rem',
              boxShadow: '0 10px 30px rgba(245, 158, 11, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s ease, border-color 0.3s ease'
            }}>
              <div style={{ display: 'flex', gap: '1.4rem', alignItems: 'center', marginBottom: '1.6rem', flexWrap: 'wrap' }}>
                <img
                  src="/images/vision.jpg"
                  alt="Our Vision"
                  style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 6px 18px rgba(0,0,0,0.1)' }}
                />
                <div>
                  <div style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#ffffff',
                    padding: '6px 18px',
                    borderRadius: '20px',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    marginBottom: '8px'
                  }}>
                    Our Vision
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#64748b' }}>Industry Leadership</div>
                </div>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem', color: '#334155' }}>
                  <CheckCircle2 size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Sustainability, Security and Safety.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem', color: '#f59e0b' }}>
                  <CheckCircle2 size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Vision to be the leading and most solicited after service provider.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem', color: '#f59e0b' }}>
                  <CheckCircle2 size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Imbibe high organizational values and standards of industry ethics.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. OUR SPECIALITY - INTERACTIVE HIGHWAY CORRIDOR MATRIX
          ======================================================== */}
      <section id="speciality" style={{ padding: '80px 0', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            {/* Left Truck Visual with Sapphire Ambient Glow */}
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '320px',
                height: '320px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, rgba(37, 99, 235, 0) 70%)',
                zIndex: 0
              }} />
              <img
                src="/images/truck.png"
                alt="Heavy Vehicle Carrier"
                style={{ position: 'relative', zIndex: 1, maxWidth: '100%', height: 'auto', filter: 'drop-shadow(0 15px 25px rgba(15, 23, 42, 0.15))' }}
              />
            </div>

            {/* Right Highway Route Corridor Board */}
            <div>
              <div style={{
                display: 'inline-block',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '0.76rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '8px'
              }}>
                Network Corridor
              </div>

              <h2 className="font-outfit" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
                Our Dedicated <span className="gradient-text-blue">Haulage Speciality</span>
              </h2>
              <div className="title-line-modern align-left" />

              <p style={{ fontSize: '1.05rem', fontWeight: 600, color: '#334155', lineHeight: 1.6, margin: '0 0 1.6rem 0' }}>
                Without any interruption: full truckload, LVC, and heavy <span style={{ color: '#2563eb', fontWeight: 800 }}>vehicle load all over India</span>.
              </p>

              {/* 7 Exact Routes as modern interactive corridor pills */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { origin: 'Nashik', dest: 'Pune, Ankleshwar, Vadodara, Mumbai, Bhiwandi, JNPT', code: 'NH-60 / NH-48' },
                  { origin: 'Sinner', dest: 'Pune, Nashik, Ankleshwar, Vadodara, Bhiwandi, Mumbai, JNPT', code: 'NH-848 / NH-50' },
                  { origin: 'Pune', dest: 'Sinner, Nashik, Ankleshwar, Vadodara, Bhiwandi, Mumbai, JNPT', code: 'NH-48 Corridor' },
                  { origin: 'Bhosari', dest: 'Bhiwandi, Ankleshwar, Nashik, Sinner, Pune, Mumbai, JNPT', code: 'PCMC Hub' },
                  { origin: 'Vadodara', dest: 'Ankleshwar, Nashik, Sinner, Pune, Mumbai, JNPT', code: 'Golden Corridor' },
                  { origin: 'Bhiwandi', dest: 'Nashik, Sinner, Ankleshwar, Vadodara, Pune, JNPT', code: 'Logistics Park' },
                  { origin: 'JNPT', dest: 'Ankleshwar, Bhiwandi, Nashik, Sinner, Pune, Mumbai, JNPT', code: 'Port Terminal' }
                ].map((route, i) => (
                  <div key={i} className="route-pill-modern">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        backgroundColor: '#1e3a8a',
                        color: '#ffffff',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        padding: '3px 9px',
                        borderRadius: '6px'
                      }}>
                        {route.origin}
                      </span>
                      <span style={{ fontSize: '0.86rem', color: '#334155', fontWeight: 500 }}>
                        ➔ {route.dest}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 700, backgroundColor: '#eff6ff', padding: '2px 8px', borderRadius: '4px', flexShrink: 0 }}>
                      {route.code}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. OUR SERVICES (Elevated 4-Column Card Grid)
          ======================================================== */}
      <section id="services" style={{ padding: '85px 0', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{
              display: 'inline-block',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#2563eb',
              padding: '4px 14px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '10px'
            }}>
              Core Capabilities
            </div>
            <h2 className="font-outfit" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>
              Engineered Fleet <span className="gradient-text-blue">Transportation Services</span>
            </h2>
            <div className="title-line-modern" />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem'
          }}>
            {/* Service 1: Full Truckload */}
            <div className="modern-service-card">
              <div style={{ height: '190px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/uploads/testimonial/3.jpg"
                  alt="Full Truckload"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(6px)',
                  color: '#38bdf8',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '0.7rem',
                  fontWeight: 800
                }}>
                  Direct FTL Transit
                </div>
              </div>
              <div style={{ padding: '1.6rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 className="font-outfit" style={{ margin: '0 0 10px 0', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  Full Truckload (FTL)
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, margin: '0 0 16px 0', flex: 1 }}>
                  Full-Truckload services are frequently demanded by businesses looking for heavy loads and dedicated door-to-door transit without transshipment delays.
                </p>
                <a href="#consignment-radar" style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.84rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Inspect Telemetry &amp; Rates <ChevronRight size={14} />
                </a>
              </div>
            </div>

            {/* Service 2: Flatbed Trailer */}
            <div className="modern-service-card">
              <div style={{ height: '190px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/uploads/testimonial/6.jpg"
                  alt="Flatbed Trailer"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(6px)',
                  color: '#fbbf24',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '0.7rem',
                  fontWeight: 800
                }}>
                  Over-Dimensional Cargo
                </div>
              </div>
              <div style={{ padding: '1.6rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 className="font-outfit" style={{ margin: '0 0 10px 0', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  Flatbed Trailer
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, margin: '0 0 16px 0', flex: 1 }}>
                  Flatbed transport services are recommended primarily because they are ideal for hauling steel structural coils, industrial transformers, and over-dimensional cargo.
                </p>
                <a href="#consignment-radar" style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.84rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Inspect Telemetry &amp; Rates <ChevronRight size={14} />
                </a>
              </div>
            </div>

            {/* Service 3: Warehousing & Distribution */}
            <div className="modern-service-card">
              <div style={{ height: '190px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/uploads/testimonial/9.jpg"
                  alt="Warehousing & Distribution Service"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(6px)',
                  color: '#34d399',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '0.7rem',
                  fontWeight: 800
                }}>
                  Smart 3PL &amp; 4PL
                </div>
              </div>
              <div style={{ padding: '1.6rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 className="font-outfit" style={{ margin: '0 0 10px 0', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  Warehousing &amp; Distribution
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, margin: '0 0 16px 0', flex: 1 }}>
                  Our warehousing and distribution systems have been designed to meet all logistics requirements with automated inventory control and cross-dock dispatching.
                </p>
                <a href="#consignment-radar" style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.84rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Inspect Telemetry &amp; Rates <ChevronRight size={14} />
                </a>
              </div>
            </div>

            {/* Service 4: Partial Truckload */}
            <div className="modern-service-card">
              <div style={{ height: '190px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/uploads/testimonial/5.jpg"
                  alt="Partial Truckload"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(6px)',
                  color: '#c084fc',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '0.7rem',
                  fontWeight: 800
                }}>
                  Consolidated LTL
                </div>
              </div>
              <div style={{ padding: '1.6rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 className="font-outfit" style={{ margin: '0 0 10px 0', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  Partial Truckload (PTL)
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, margin: '0 0 16px 0', flex: 1 }}>
                  We have simplified transportation management by using partial truckload carriers to make timely deliveries with cost optimization and flexible drops.
                </p>
                <a href="#consignment-radar" style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.84rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Inspect Telemetry &amp; Rates <ChevronRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. CUSTOMER REVIEWS (Deep Midnight Blue with Stars)
          ======================================================== */}
      <section id="customer-reviews" style={{
        padding: '85px 0',
        backgroundColor: '#0b1329',
        color: '#ffffff'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{
              display: 'inline-block',
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              color: '#93c5fd',
              padding: '4px 14px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '10px'
            }}>
              Client Endorsements
            </div>
            <h2 className="font-outfit" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              What Our Enterprise <span className="gradient-text-blue">Partners Say</span>
            </h2>
            <div className="title-line-modern" />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '2rem'
          }}>
            {/* Review 1: Vikas */}
            <div className="modern-review-card" style={{ borderTopColor: '#2563eb' }}>
              <div className="speech-notch" />
              <div style={{ display: 'flex', gap: '3px', marginBottom: '12px', color: '#f59e0b' }}>
                <Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" />
              </div>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#334155', lineHeight: 1.7, fontStyle: 'italic' }}>
                “Excellent service given by Renuka Logistics, they provide hassle-free & on-time delivery truck service with affordable price & safety, they are really an excellent service provider.”
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                <span style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a' }}>Vikas</span>
                <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '10px' }}>✓ Verified Partner</span>
              </div>
            </div>

            {/* Review 2: Yogesh */}
            <div className="modern-review-card" style={{ borderTopColor: '#f59e0b' }}>
              <div className="speech-notch" />
              <div style={{ display: 'flex', gap: '3px', marginBottom: '12px', color: '#f59e0b' }}>
                <Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" />
              </div>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#334155', lineHeight: 1.7, fontStyle: 'italic' }}>
                “Renuka Logistics is an Large Transportation Company in Nashik and Pune. They have owned trucks and contract for loads so it&apos;s good for income and overall good service and they have their own warehouse.”
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                <span style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a' }}>Yogesh</span>
                <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '10px' }}>✓ Verified Partner</span>
              </div>
            </div>

            {/* Review 3: Santosh */}
            <div className="modern-review-card" style={{ borderTopColor: '#10b981' }}>
              <div className="speech-notch" />
              <div style={{ display: 'flex', gap: '3px', marginBottom: '12px', color: '#f59e0b' }}>
                <Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" />
              </div>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#334155', lineHeight: 1.7, fontStyle: 'italic' }}>
                “Committed transportation service. I am very much satisfied with the Renuka logistics service quality, and the driver was really good and he delivered the consignment before the expected time! Absolutely, a recommended transportation service.”
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                <span style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a' }}>Santosh</span>
                <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '10px' }}>✓ Verified Partner</span>
              </div>
            </div>

            {/* Review 4: Nilesh */}
            <div className="modern-review-card" style={{ borderTopColor: '#8b5cf6' }}>
              <div className="speech-notch" />
              <div style={{ display: 'flex', gap: '3px', marginBottom: '12px', color: '#f59e0b' }}>
                <Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" />
              </div>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#334155', lineHeight: 1.7, fontStyle: 'italic' }}>
                “They are the most responsive company, the delivery time is also according to my demand, the overall experience is excellent with Renuka logistics.”
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                <span style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a' }}>Nilesh</span>
                <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '10px' }}>✓ Verified Partner</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          9. CLIENT LOGO WALL
          ======================================================== */}
      <section id="sponsors" style={{ padding: '60px 0', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '0.84rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
              Trusted by Premier Manufacturing &amp; Industrial Leaders
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))',
            gap: '1.2rem',
            alignItems: 'center',
            justifyItems: 'center'
          }}>
            {[
              { img: '/uploads/sponsor/5.jpg', name: 'Abijeet' },
              { img: '/uploads/sponsor/6.jpg', name: 'A.P.R.A.S. Ltd' },
              { img: '/uploads/sponsor/7.png', name: 'Imperial Auto' },
              { img: '/uploads/sponsor/8.jpg', name: 'JP Enterprises' },
              { img: '/uploads/sponsor/9.png', name: 'Lear Corporation' },
              { img: '/uploads/sponsor/10.jpg', name: 'Aarati' },
              { img: '/uploads/sponsor/11.jpg', name: 'SUDAL Industries Ltd' },
              { img: '/uploads/sponsor/12.png', name: 'ABB Ltd' },
              { img: '/uploads/sponsor/13.jpg', name: 'Smart Solutions' },
              { img: '/uploads/sponsor/14.png', name: 'Jyoti Ltd' },
              { img: '/uploads/sponsor/15.png', name: 'Ukay Metal' },
              { img: '/uploads/sponsor/16.jpg', name: 'L & T' },
              { img: '/uploads/sponsor/17.jpg', name: 'Lucy Switchgear' },
              { img: '/uploads/sponsor/18.png', name: 'Mahindra' },
              { img: '/uploads/sponsor/20.png', name: 'Schneider Electric' },
              { img: '/uploads/sponsor/21.png', name: 'Stelmec' },
              { img: '/uploads/sponsor/22.png', name: 'Safari' },
              { img: '/uploads/sponsor/23.png', name: 'Future Supply Chain' }
            ].map((sponsor, idx) => (
              <div
                key={idx}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '75px',
                  width: '100%',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                title={sponsor.name}
              >
                <img
                  src={sponsor.img}
                  alt={sponsor.name}
                  style={{ maxHeight: '46px', maxWidth: '90px', objectFit: 'contain' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          10. CONSIGNMENT RADAR GATEWAY (Dedicated Tab Launcher)
              Gated strictly behind sign-in as instructed!
          ======================================================== */}
      <section id="consignment-radar" style={{
        padding: '85px 0',
        backgroundColor: '#090e1a',
        borderTop: '4px solid #2563eb',
        color: '#ffffff'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          
          {!supabaseUser ? (
            /* STATE A: NOT SIGNED IN */
            <div style={{
              maxWidth: '860px',
              margin: '0 auto',
              backgroundColor: '#0f172a',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '16px',
              padding: 'clamp(1.8rem, 4vw, 3rem)',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '2.2rem' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 14px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(37, 99, 235, 0.18)',
                  border: '1px solid rgba(37, 99, 235, 0.45)',
                  color: '#93c5fd',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  marginBottom: '1rem'
                }}>
                  <ShieldCheck size={15} color="#38bdf8" /> Verified Consignment Radar Gate
                </div>

                <h2 className="font-outfit" style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)', fontWeight: 800, color: '#ffffff', margin: '0 0 0.6rem 0' }}>
                  Sign In to Unlock Live Consignment Radar
                </h2>
                <p style={{ fontSize: '0.92rem', color: '#94a3b8', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto' }}>
                  Access real-time GPS telemetry, mountain pass weather sensors, automated Dijkstra safe detour charts, and consignment delivery tracking across India.
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                gap: '2rem',
                alignItems: 'start'
              }}>
                {/* Credentials Form */}
                <form onSubmit={handleUserSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <Mail size={14} color="#38bdf8" /> Officer / Transporter Email
                    </label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="officer@renukalogistics.com"
                      style={{
                        width: '100%',
                        fontSize: '0.88rem',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        backgroundColor: '#070c18',
                        color: '#ffffff',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <Lock size={14} color="#38bdf8" /> Password
                    </label>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      style={{
                        width: '100%',
                        fontSize: '0.88rem',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        backgroundColor: '#070c18',
                        color: '#ffffff',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSigningIn}
                    className="btn-modern-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '13px' }}
                  >
                    {isSigningIn ? (
                      <>
                        <RefreshCw size={16} className="spin" /> Verifying Clearance...
                      </>
                    ) : (
                      <>
                        <LogIn size={16} /> Sign In &amp; Access Radar
                      </>
                    )}
                  </button>
                </form>

                {/* Instant 1-Click Sandbox Access */}
                <div style={{
                  backgroundColor: 'rgba(7, 12, 24, 0.9)',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '8px' }}>
                    <KeyRound size={16} color="#f59e0b" />
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>
                      Instant One-Click Demo Access
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                    Click below to immediately evaluate the live GIS Map, slope sensors, Dijkstra rerouting, and Traccar convoy telemetry without typing credentials:
                  </p>

                  <button
                    onClick={() => handleDemoSignIn('OFFICER')}
                    style={{
                      background: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      color: '#38bdf8',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <ShieldCheck size={16} color="#38bdf8" /> ⚡ Instant Access: Patrol Officer
                  </button>

                  <button
                    onClick={() => handleDemoSignIn('DRIVER')}
                    style={{
                      background: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      color: '#34d399',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Truck size={16} color="#34d399" /> 🚛 Instant Access: Convoy Driver
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* STATE B: SIGNED IN -> DEDICATED NEW TAB BUTTON */
            <div style={{
              maxWidth: '860px',
              margin: '0 auto',
              backgroundColor: '#0f172a',
              border: '2px solid #2563eb',
              borderRadius: '16px',
              padding: 'clamp(1.8rem, 4vw, 2.8rem)',
              boxShadow: '0 20px 45px rgba(37, 99, 235, 0.25)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                paddingBottom: '1.2rem',
                marginBottom: '1.8rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(37, 99, 235, 0.25)',
                    color: '#38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>
                      {supabaseUser.name}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                      {supabaseUser.email} • <span style={{ color: '#38bdf8', fontWeight: 700 }}>{supabaseUser.role}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  style={{
                    background: 'none',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#ef4444',
                    padding: '7px 16px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>

              {/* High-Impact Dedicated Tab Launch Banner */}
              <div style={{
                textAlign: 'center',
                padding: '2rem 1.5rem',
                background: 'linear-gradient(180deg, rgba(37, 99, 235, 0.15) 0%, rgba(7, 12, 24, 0.6) 100%)',
                borderRadius: '14px',
                border: '1px solid rgba(37, 99, 235, 0.35)',
                marginBottom: '1.8rem'
              }}>
                <h3 className="font-outfit" style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2.2rem)', fontWeight: 800, color: '#ffffff', margin: '0 0 0.8rem 0' }}>
                  Renuka Logistics Live Consignment Radar
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#cbd5e1', maxWidth: '600px', margin: '0 auto 1.8rem auto', lineHeight: 1.6 }}>
                  Launch the full-screen GIS operations console featuring live vehicle convoy telemetry, bearing rotation, glowing headlight projections, mountain pass shear sensors, and automated Dijkstra rerouting.
                </p>

                {/* THE DEDICATED NEW TAB BUTTON */}
                <a
                  href="/map"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-modern-amber"
                  style={{
                    padding: '15px 36px',
                    fontSize: '1.02rem',
                    boxShadow: '0 8px 26px rgba(245, 158, 11, 0.4)'
                  }}
                >
                  <ExternalLink size={20} /> Open Consignment Radar in Dedicated Tab
                </a>
              </div>

              {/* Status Pills */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px'
              }}>
                <div style={{ backgroundColor: '#070c18', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Fleet Radar Vehicles</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>8 Active HCVs</div>
                </div>
                <div style={{ backgroundColor: '#070c18', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Pan-India Coverage</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>28 State Nodes</div>
                </div>
                <div style={{ backgroundColor: '#070c18', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Emergency Routing</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b' }}>Dijkstra AI Safe</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          11. FOOTER (Deep Midnight Titanium & Sapphire)
          ======================================================== */}
      <footer id="contact" style={{ backgroundColor: '#080e1a', color: '#ffffff', paddingTop: '70px', borderTop: '1px solid rgba(37, 99, 235, 0.25)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem 50px 1.5rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem'
          }}>
            {/* Column 1: Logo Card */}
            <div style={{
              backgroundColor: '#ffffff',
              padding: '2.2rem 1.5rem',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
            }}>
              <img
                src="/images/logo.png"
                alt="Renuka Logistics"
                style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
              />
              <div style={{ fontSize: '0.76rem', color: '#64748b', textAlign: 'center', marginTop: '14px', fontWeight: 700 }}>
                Logistics Services &amp; Supply-Chain Solutions
              </div>
            </div>

            {/* Column 2: Head Office */}
            <div>
              <h4 className="font-outfit" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', margin: '0 0 14px 0' }}>
                Head Office
              </h4>
              <div style={{ width: '40px', height: '2px', backgroundColor: '#38bdf8', marginBottom: '18px' }} />
              <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.8, margin: 0 }}>
                Plot No 21/1A, MIDC Satpur<br />
                Opp. SI Ground, Near to Anand I Power Company<br />
                Nashik - 422007, Maharashtra, India
              </p>
            </div>

            {/* Column 3: Contact */}
            <div>
              <h4 className="font-outfit" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', margin: '0 0 14px 0' }}>
                Contact Hotlines
              </h4>
              <div style={{ width: '40px', height: '2px', backgroundColor: '#38bdf8', marginBottom: '18px' }} />
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#cbd5e1' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={14} color="#38bdf8" /> Landline: +91(253) 3266888
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={14} color="#38bdf8" /> Mobile: +91 9372433888
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={14} color="#38bdf8" /> Email: info@renukalogistics.com
                </li>
              </ul>
            </div>

            {/* Column 4: Quick Links */}
            <div>
              <h4 className="font-outfit" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', margin: '0 0 14px 0' }}>
                Operations
              </h4>
              <div style={{ width: '40px', height: '2px', backgroundColor: '#38bdf8', marginBottom: '18px' }} />
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                <li><a href="#" style={{ color: '#cbd5e1', textDecoration: 'none' }}>› Home</a></li>
                <li><a href="#about-us" style={{ color: '#cbd5e1', textDecoration: 'none' }}>› About Us</a></li>
                <li><a href="#speciality" style={{ color: '#cbd5e1', textDecoration: 'none' }}>› Dedicated Corridors</a></li>
                <li><a href="#services" style={{ color: '#cbd5e1', textDecoration: 'none' }}>› Fleet Services</a></li>
                <li><a href="#customer-reviews" style={{ color: '#cbd5e1', textDecoration: 'none' }}>› Customer Reviews</a></li>
                <li><a href="#consignment-radar" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 700 }}>› Consignment Radar</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div style={{ backgroundColor: '#04070d', padding: '16px 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            fontSize: '0.78rem',
            color: '#64748b'
          }}>
            <span>Copyright © 2026 <strong>Renuka Logistics</strong>. All Rights Reserved.</span>
            <span>Next-Gen Transportation &amp; Supply-Chain Management Solution</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
