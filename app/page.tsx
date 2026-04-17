'use client';

import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

const LandingPage = () => {
  const prefersReducedMotion = useReducedMotion();

  const stats = useMemo(() => [
    { label: 'Patients Assisted', value: '250K+' },
    { label: 'Medication Lookups', value: '1.8M+' },
    { label: 'Supported Languages', value: '40+' },
    { label: 'Response Time', value: '< 2s' }
  ], []);

  const features = useMemo(() => [
    {
      title: 'AI Medication Intelligence',
      description: 'Search any medicine and instantly get plain-language uses, dosage notes, and warning context.',
      icon: '🧠'
    },
    {
      title: 'Image-to-Insight OCR',
      description: 'Upload medicine labels and let OCR extract text and map it to structured medication guidance.',
      icon: '📷'
    },
    {
      title: 'Multilingual Care Support',
      description: 'Translate healthcare content and communication into the language patients understand best.',
      icon: '🌐'
    },
    {
      title: 'Safety-First Guidance',
      description: 'Built to highlight contraindications, side effects, and critical caution points quickly.',
      icon: '🛡️'
    }
  ], []);

  const workflow = useMemo(() => [
    {
      step: '01',
      title: 'Patient Intake and Medication Capture',
      description: 'Collect a medication name from chat or upload a label image. Medlex extracts core text and context in seconds.',
      tags: ['AI Intake', 'OCR Scan', 'Multilingual'],
      visualTitle: 'Captured label confidence',
      visualMetric: '98.4%',
    },
    {
      step: '02',
      title: 'Clinical Triage and Risk Highlighting',
      description: 'AI structures uses, dosage signals, interactions, and contraindications into a clinician-friendly snapshot.',
      tags: ['Risk Flags', 'Real-time', 'Structured'],
      visualTitle: 'Critical issues auto-detected',
      visualMetric: '12',
    },
    {
      step: '03',
      title: 'Provider Review and Patient Guidance',
      description: 'Care teams validate recommendations and deliver clear, localized instructions patients can understand.',
      tags: ['Provider Review', 'Patient-safe', 'Localized'],
      visualTitle: 'Patient understanding uplift',
      visualMetric: '+41%',
    },
  ], []);

  const testimonials = useMemo(() => [
    {
      quote: 'Medlex helps our team explain medications faster and with clearer patient communication. We reduced back-and-forth clarification dramatically.',
      name: 'Dr. Anita Rao',
      role: 'Family Physician',
      rating: 5
    },
    {
      quote: 'The OCR flow is excellent. We can scan labels and get helpful summaries in seconds, even with noisy packaging photos from mobile devices.',
      name: 'Michael K.',
      role: 'Clinical Assistant',
      rating: 5
    },
    {
      quote: 'Our multilingual counseling quality improved immediately. Medlex made complex instructions simple for both staff and patients.',
      name: 'Sara M.',
      role: 'Care Coordinator',
      rating: 5
    }
  ], []);

  const fadeIn = {
    initial: prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-cyan-50/40 to-slate-100 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-white/30 bg-white/35 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 rounded-xl border border-white/40 bg-white/30 px-2 py-1 backdrop-blur-md">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30">
              ✦
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">Medlex</p>
              <p className="text-xs text-slate-500">AI Healthcare Platform</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 rounded-full border border-white/35 bg-white/35 px-5 py-2 text-sm text-slate-700 backdrop-blur-md md:flex">
            <a href="#features" className="transition-colors hover:text-slate-900">Features</a>
            <a href="#workflow" className="transition-colors hover:text-slate-900">How It Works</a>
            <a href="#testimonials" className="transition-colors hover:text-slate-900">Testimonials</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/preferences"
              className="hidden rounded-lg border border-white/50 bg-white/30 px-4 py-2 text-sm font-medium text-slate-700 backdrop-blur-md transition-colors hover:bg-white/50 sm:inline-flex"
            >
              Preferences
            </Link>
            <Link
              href="/home"
              className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-cyan-500/20 transition-transform hover:-translate-y-0.5"
            >
              Launch Dashboard
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute left-[-120px] top-[-80px] h-[320px] w-[320px] rounded-full bg-cyan-300/30 blur-3xl" />
          <div className="absolute bottom-[-120px] right-[-100px] h-[360px] w-[360px] rounded-full bg-blue-400/30 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.7),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(56,189,248,0.18),transparent_35%)]" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:pb-20 lg:pt-20">
          <motion.div
            {...fadeIn}
            className="max-w-2xl"
          >
            <div className="mb-5 inline-flex items-center rounded-full border border-white/60 bg-white/55 px-4 py-1 text-xs font-semibold text-cyan-700 backdrop-blur-md">
              HIPAA-aware workflows for digital health teams
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              The Future of <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Healthcare Intelligence</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Deliver fast, reliable medication insights with OCR + AI. Help patients understand treatment details, improve communication, and reduce confusion at point of care.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/home"
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition-transform hover:-translate-y-0.5"
              >
                Launch Dashboard
              </Link>
              <a
                href="#workflow"
                className="rounded-xl border border-white/60 bg-white/45 px-6 py-3 text-sm font-semibold text-slate-700 backdrop-blur-md transition-colors hover:bg-white/65"
              >
                Watch How It Works
              </a>
            </div>

            <div className="mt-8 flex items-center gap-6 text-xs text-slate-500">
              <span>Trusted by modern care teams</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span>Built for multilingual patient support</span>
            </div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            className="relative"
          >
            <div className="rounded-3xl border border-white/50 bg-white/35 p-3 shadow-2xl shadow-cyan-900/20 backdrop-blur-xl">
              <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-700/90">
                <div className="absolute inset-0 bg-[url('/medical-pattern.svg')] opacity-20" />
                <div className="absolute left-4 top-4 rounded-lg border border-amber-200/40 bg-amber-300/80 px-3 py-1 text-xs font-semibold text-amber-950 backdrop-blur">
                  Live Analysis
                </div>
                <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/50 bg-white/45 p-4 backdrop-blur-lg">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Active Patients Today</p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">247</p>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-5 -top-4 hidden rounded-xl border border-cyan-100/50 bg-white/60 px-3 py-2 text-xs font-semibold text-cyan-700 backdrop-blur-md lg:block">
              SOC 2 Ready
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-white/40 bg-white/30 py-8 backdrop-blur-lg">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/40 bg-white/35 py-4 text-center backdrop-blur-md">
              <p className="text-2xl font-bold text-slate-900 sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeIn} className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600">Platform Highlights</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Designed for speed, clarity, and trust
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl border border-white/45 bg-white/35 p-6 shadow-lg shadow-slate-300/20 backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-white/45 hover:shadow-xl"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/55 bg-white/45 text-2xl backdrop-blur" role="img" aria-label={feature.title}>{feature.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="workflow" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600">Workflow</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">How it works</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              A seamless three-step care workflow from first patient input to safe, confirmed medication guidance.
            </p>
          </motion.div>

          <div className="space-y-8">
            {workflow.map((item, index) => (
              <motion.div
                key={item.step}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`grid gap-6 rounded-3xl border border-white/45 bg-white/35 p-6 backdrop-blur-md lg:grid-cols-2 ${
                  index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
                }`}
              >
                <div className="flex flex-col justify-center">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-bold text-white">
                    {item.step}
                  </div>
                  <h3 className="mb-2 text-2xl font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-cyan-100/70 bg-cyan-50/70 px-3 py-1 text-xs font-medium text-cyan-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-white/50 bg-gradient-to-br from-slate-900/90 to-slate-700/90 p-5 shadow-xl shadow-slate-900/20">
                  <div className="absolute inset-0 bg-[url('/medical-pattern.svg')] opacity-20" />
                  <div className="relative">
                    <p className="text-xs font-semibold uppercase tracking-wider text-cyan-200">{item.visualTitle}</p>
                    <p className="mt-2 text-4xl font-bold text-white">{item.visualMetric}</p>
                    <div className="mt-6 space-y-3">
                      <div className="h-2 rounded-full bg-white/20">
                        <div className="h-2 w-4/5 rounded-full bg-gradient-to-r from-cyan-300 to-blue-400" />
                      </div>
                      <div className="h-2 rounded-full bg-white/20">
                        <div className="h-2 w-3/5 rounded-full bg-gradient-to-r from-cyan-200 to-indigo-300" />
                      </div>
                      <div className="h-2 rounded-full bg-white/20">
                        <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-cyan-100 to-blue-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600">What teams say</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Trusted by healthcare innovators</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Join care teams using Medlex to improve patient understanding, safety, and operational speed.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <div key={item.name} className="rounded-2xl border border-white/50 bg-white/40 p-6 shadow-lg shadow-slate-300/20 backdrop-blur-md">
                <div className="mb-4 flex text-amber-400">
                  {Array.from({ length: item.rating }).map((_, starIndex) => (
                    <span key={`${item.name}-star-${starIndex}`}>★</span>
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-slate-600">"{item.quote}"</p>
                <p className="mt-5 text-sm font-semibold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">{item.role}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              '500+ Healthcare Facilities',
              '95% Positive Satisfaction',
              'SOC 2 Type II Security',
              '24/7 Patient Support'
            ].map((proof) => (
              <div key={proof} className="rounded-xl border border-white/40 bg-white/35 px-4 py-3 text-center text-xs font-medium text-slate-600 backdrop-blur-md">
                {proof}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/35 bg-gradient-to-r from-slate-900/90 to-slate-800/90 px-6 py-10 text-center text-white shadow-2xl shadow-slate-700/30 backdrop-blur-xl sm:px-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">Ready to modernize medication guidance?</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Start using Medlex today</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
              Give your team instant AI assistance for medicine understanding, multilingual support, and safer communication.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/home" className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100">
                Open App
              </Link>
              <Link href="/preferences" className="rounded-xl border border-white/50 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15">
                Set Preferences
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-8 border-t border-slate-200 bg-slate-100/80">
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500" />
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 border-b border-slate-200 pb-10 md:grid-cols-5">
            <div className="md:col-span-2">
              <Link href="/" className="mb-4 inline-flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20">
                  ✦
                </div>
                <div>
                  <p className="text-base font-semibold leading-none text-slate-900">Medlex</p>
                  <p className="text-xs text-slate-500">AI Healthcare Platform</p>
                </div>
              </Link>
              <p className="max-w-sm text-sm leading-relaxed text-slate-600">
                Revolutionizing healthcare delivery with enterprise-grade AI automation and intelligent patient care coordination.
              </p>
              <p className="mt-5 text-xs font-medium uppercase tracking-wide text-slate-500">Subscribe to our newsletter</p>
              <div className="mt-2 flex max-w-sm items-center gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none"
                />
                <button className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white">
                  Subscribe
                </button>
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-slate-900">Product</p>
              <div className="space-y-2 text-sm text-slate-600">
                <a href="#features" className="block transition-colors hover:text-slate-900">Features</a>
                <a href="#workflow" className="block transition-colors hover:text-slate-900">How It Works</a>
                <Link href="/home" className="block transition-colors hover:text-slate-900">Dashboard</Link>
                <Link href="/preferences" className="block transition-colors hover:text-slate-900">Preferences</Link>
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-slate-900">Company</p>
              <div className="space-y-2 text-sm text-slate-600">
                <Link href="/about" className="block transition-colors hover:text-slate-900">About Us</Link>
                <Link href="/careers" className="block transition-colors hover:text-slate-900">Careers</Link>
                <Link href="/blog" className="block transition-colors hover:text-slate-900">Blog</Link>
                <Link href="/contact" className="block transition-colors hover:text-slate-900">Partners</Link>
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-slate-900">Legal</p>
              <div className="space-y-2 text-sm text-slate-600">
                <Link href="/privacy" className="block transition-colors hover:text-slate-900">Privacy Policy</Link>
                <Link href="/terms" className="block transition-colors hover:text-slate-900">Terms of Service</Link>
                <a href="#" className="block transition-colors hover:text-slate-900">HIPAA Compliance</a>
                <a href="#" className="block transition-colors hover:text-slate-900">Security</a>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 border-b border-slate-200 pb-6 text-xs text-slate-600 md:grid-cols-3">
            <a href="mailto:support@medlex.ai" className="rounded-lg border border-slate-200 bg-white px-3 py-2 transition-colors hover:bg-slate-50">
              support@medlex.ai
            </a>
            <a href="tel:+15551234567" className="rounded-lg border border-slate-200 bg-white px-3 py-2 transition-colors hover:bg-slate-50">
              +25499137198
            </a>
            <span className="rounded-lg border border-slate-200 bg-white px-3 py-2">
              Nairobi,Kenya
            </span>
          </div>

          <div className="mt-6 flex flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
            <p>&copy; {new Date().getFullYear()} Medlex. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-3">
              <span>AI Systems Operational</span>
              <span className="h-1 w-1 rounded-full bg-slate-400" />
              <span>SOC 2 Type II Certified</span>
              <span className="h-1 w-1 rounded-full bg-slate-400" />
              <span>HIPAA &amp; GDPR Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 